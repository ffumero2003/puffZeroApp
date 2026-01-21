// src/viewmodels/app/useProgressViewModel.ts
import { useUserData } from "@/src/hooks/useUserData";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const LAST_PUFF_TIME_KEY = "lastPuffTime";

type PuffRecord = {
  id: string;
  timestamp: string;
  count: number;
};

type ChartDataPoint = {
  x: string | number;
  y: number;
  label?: string;
};

type TimeRange = "7days" | "30days" | "all";

export function useProgressViewModel() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  const { profile_created_at, goal_speed, money_per_month, currency } = useOnboarding();

  const [loading, setLoading] = useState(true);
  const [puffs, setPuffs] = useState<PuffRecord[]>([]);
  const [lastPuffTime, setLastPuffTime] = useState<Date | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("7days");

  // Load puff data from Supabase
  const loadPuffData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("puffs")
        .select("id, timestamp, count")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error loading puffs:", error);
      } else {
        setPuffs(data || []);
        
        // Set last puff time from most recent record
        if (data && data.length > 0) {
          setLastPuffTime(new Date(data[0].timestamp));
        }
      }
    } catch (error) {
      console.error("Error fetching puffs:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load last puff time from AsyncStorage as fallback
  const loadLastPuffFromStorage = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(LAST_PUFF_TIME_KEY);
      if (stored) {
        setLastPuffTime(prev => prev ? prev : new Date(stored));
      }
    } catch (error) {
      console.error("Error loading last puff time:", error);
    }
  }, []);

  useEffect(() => {
    loadPuffData();
    loadLastPuffFromStorage();
  }, [user?.id]);

  // Time since last puff (formatted)
  const timeSinceLastPuff = useMemo(() => {
    if (!lastPuffTime) return "Nunca";
    
    const now = new Date();
    const diff = now.getTime() - lastPuffTime.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return "hace un momento";
  }, [lastPuffTime]);

  // Get profile created date
  const profileCreatedDate = useMemo(() => {
    if (profile_created_at) {
      return new Date(profile_created_at);
    }
    if (profile?.created_at) {
      return new Date(profile.created_at);
    }
    return new Date();
  }, [profile_created_at, profile?.created_at]);

  // Goal speed in days (from onboarding or profile)
  const goalSpeedDays = useMemo(() => {
    const speed = goal_speed || profile?.goal_speed;
    return speed ? parseInt(speed, 10) : 21;
  }, [goal_speed, profile?.goal_speed]);

  // Calculate countdown to goal
  const countdownToGoal = useMemo(() => {
    const endTime = new Date(profileCreatedDate.getTime() + goalSpeedDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = Math.max(0, endTime.getTime() - now.getTime());

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    return { days, hours, minutes, seconds, totalMs: diff };
  }, [profileCreatedDate, goalSpeedDays]);

  // Count puffs in time range
  const countPuffsInRange = useCallback((hours: number) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    
    return puffs
      .filter(p => new Date(p.timestamp) >= cutoff)
      .reduce((sum, p) => sum + p.count, 0);
  }, [puffs]);

  // Puff statistics
  const puffsLast24Hours = useMemo(() => countPuffsInRange(24), [countPuffsInRange]);
  const puffsLast7Days = useMemo(() => countPuffsInRange(24 * 7), [countPuffsInRange]);
  const puffsLast30Days = useMemo(() => countPuffsInRange(24 * 30), [countPuffsInRange]);

  // Money saved calculation
  const moneySaved = useMemo(() => {
    const monthlyMoney = money_per_month || profile?.money_per_month || 0;
    const daysSinceStart = Math.max(0, (Date.now() - profileCreatedDate.getTime()) / (1000 * 60 * 60 * 24));
    return (monthlyMoney / 30) * daysSinceStart;
  }, [money_per_month, profile?.money_per_month, profileCreatedDate]);

  // Get currency symbol
  const currencySymbol = useMemo(() => {
    const curr = currency || profile?.currency || "CRC";
    const symbols: Record<string, string> = {
      CRC: "₡",
      USD: "$",
      EUR: "€",
      MXN: "$",
    };
    return symbols[curr] || curr;
  }, [currency, profile?.currency]);

  // Streak calculation (time since last puff)
  const streak = useMemo(() => {
    if (!lastPuffTime) {
      // If never smoked, calculate from profile creation
      const diff = Date.now() - profileCreatedDate.getTime();
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      return { days, hours, minutes, seconds };
    }

    const diff = Math.max(0, Date.now() - lastPuffTime.getTime());
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    return { days, hours, minutes, seconds };
  }, [lastPuffTime, profileCreatedDate]);

  // Aggregate puffs by day for charts
  const aggregatePuffsByDay = useCallback((days: number | null) => {
    const now = new Date();
    const aggregated: Record<string, number> = {};
    
    // Determine date range
    let startDate: Date;
    if (days === null) {
      startDate = profileCreatedDate;
    } else {
      startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    // Filter puffs in range
    const filteredPuffs = puffs.filter(p => {
      const puffDate = new Date(p.timestamp);
      return puffDate >= startDate && puffDate <= now;
    });

    // Aggregate by date string
    filteredPuffs.forEach(p => {
      const dateKey = new Date(p.timestamp).toISOString().split("T")[0];
      aggregated[dateKey] = (aggregated[dateKey] || 0) + p.count;
    });

    // Fill in missing days with 0
    const result: ChartDataPoint[] = [];
    const totalDays = days || Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    
    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const dayLabel = date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
      
      result.push({
        x: dayLabel,
        y: aggregated[dateKey] || 0,
        label: `${aggregated[dateKey] || 0}`,
      });
    }

    return result;
  }, [puffs, profileCreatedDate]);

  // Chart data based on selected time range
  const chartData = useMemo(() => {
    switch (selectedTimeRange) {
      case "7days":
        return aggregatePuffsByDay(7);
      case "30days":
        return aggregatePuffsByDay(30);
      case "all":
        return aggregatePuffsByDay(null);
      default:
        return aggregatePuffsByDay(7);
    }
  }, [selectedTimeRange, aggregatePuffsByDay]);

  // Calculate days since profile creation
  const daysSinceStart = useMemo(() => {
    return Math.floor((Date.now() - profileCreatedDate.getTime()) / (24 * 60 * 60 * 1000));
  }, [profileCreatedDate]);

  

  // Daily goal from profile
  const dailyGoal = profile?.puffs_per_day || 200;

  return {
    loading: loading || profileLoading,
    
    // Last update time
    timeSinceLastPuff,
    lastPuffTime,
    
    // Countdown to goal
    countdownToGoal,
    goalSpeedDays,
    profileCreatedDate,
    
    // Puff statistics
    puffsLast24Hours,
    puffsLast7Days,
    puffsLast30Days,
    
    // Money saved
    moneySaved,
    currencySymbol,
    currency: currency || profile?.currency || "CRC",
    
    // Streak
    streak,
    
    // Charts
    chartData,
    dailyGoal,
    selectedTimeRange,
    setSelectedTimeRange,
    daysSinceStart,
    
    // Actions
    refreshData: loadPuffData,
  };
}
