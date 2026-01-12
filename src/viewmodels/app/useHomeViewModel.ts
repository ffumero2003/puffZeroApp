// src/viewmodels/app/useHomeViewModel.ts
import { useUserData } from "@/src/hooks/useUserData";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { fetchAIQuote } from "@/src/services/ai-quotes-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

const LAST_PUFF_TIME_KEY = "lastPuffTime";
const TODAY_PUFFS_KEY = "todayPuffs";
const TODAY_DATE_KEY = "todayDate";

type DayPuffs = {
  date: string;
  day: string;
  puffs: number;
  isToday: boolean;
};

type WeekData = {
  weekLabel: string;
  days: DayPuffs[];
};

export function useHomeViewModel() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserData();
  
  const [todayPuffs, setTodayPuffs] = useState(0);
  const [lastPuffTime, setLastPuffTime] = useState<Date | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [currentWeek, setCurrentWeek] = useState<WeekData | null>(null);

  // Memoize firstName to avoid recalculation and fix TypeScript issue
  const firstName = useMemo(() => {
    const fullName = profile?.full_name || user?.user_metadata?.full_name || "Usuario";
    return fullName.trim().split(" ")[0];
  }, [profile?.full_name, user?.user_metadata?.full_name]);

  // Get daily goal
  const dailyGoal = profile?.puffs_per_day || 200;

  // Calculate percentage
  const percentage = Math.min(Math.round((todayPuffs / dailyGoal) * 100), 100);

  // Get time since last puff
  const getTimeSinceLastPuff = useCallback(() => {
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

  // Load persisted data from AsyncStorage on mount
  const loadPersistedData = useCallback(async () => {
    try {
      const [storedLastPuff, storedTodayPuffs, storedDate] = await Promise.all([
        AsyncStorage.getItem(LAST_PUFF_TIME_KEY),
        AsyncStorage.getItem(TODAY_PUFFS_KEY),
        AsyncStorage.getItem(TODAY_DATE_KEY),
      ]);

      // Check if we need to reset for a new day
      const today = new Date().toDateString();
      if (storedDate !== today) {
        // Reset for new day
        await AsyncStorage.setItem(TODAY_DATE_KEY, today);
        await AsyncStorage.setItem(TODAY_PUFFS_KEY, "0");
        setTodayPuffs(0);
      } else if (storedTodayPuffs) {
        setTodayPuffs(parseInt(storedTodayPuffs, 10));
      }

      if (storedLastPuff) {
        setLastPuffTime(new Date(storedLastPuff));
      }

      // Also try to load from Supabase for the most recent puff
      if (user?.id) {
        const { data } = await supabase
          .from("puffs")
          .select("timestamp")
          .eq("user_id", user.id)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data?.timestamp) {
          const supabaseLastPuff = new Date(data.timestamp);
          // Use the more recent one
          if (!storedLastPuff || supabaseLastPuff > new Date(storedLastPuff)) {
            setLastPuffTime(supabaseLastPuff);
            await AsyncStorage.setItem(LAST_PUFF_TIME_KEY, supabaseLastPuff.toISOString());
          }
        }
      }
    } catch (error) {
      console.error("Error loading persisted data:", error);
    }
  }, [user?.id]);

  // Generate current week data only
  const generateCurrentWeek = useCallback(() => {
    const today = new Date();
    
    // Get start of current week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const days: DayPuffs[] = [];
    const dayNames = ["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"];
    
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      
      const isToday = currentDay.toDateString() === today.toDateString();
      
      days.push({
        date: currentDay.toISOString(),
        day: dayNames[i],
        puffs: isToday ? todayPuffs : 0,
        isToday,
      });
    }
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLabel = `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('es-ES', { month: 'long' })}, ${weekStart.getFullYear()}`;
    
    setCurrentWeek({ weekLabel, days });
  }, [todayPuffs]);

  // Load AI-generated motivational message
  const loadMotivationalMessage = useCallback(async () => {
    const quote = await fetchAIQuote({
      percentage,
    });
    setMotivationalMessage(quote);
  }, [percentage]);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  // Generate week when todayPuffs changes
  useEffect(() => {
    generateCurrentWeek();
  }, [generateCurrentWeek]);

  // Load motivational message on mount and when profile loads
  useEffect(() => {
    if (!profileLoading) {
      loadMotivationalMessage();
    }
  }, [profileLoading]);

  // Reload quote when puffs change significantly (every 5 puffs or when reaching limits)
  useEffect(() => {
    if (todayPuffs > 0 && (todayPuffs % 5 === 0 || todayPuffs === dailyGoal)) {
      loadMotivationalMessage();
    }
  }, [todayPuffs, dailyGoal]);

  const addPuff = useCallback(async () => {
    const now = new Date();
    const newPuffCount = todayPuffs + 1;
    
    // Update state immediately for UI responsiveness
    setTodayPuffs(newPuffCount);
    setLastPuffTime(now);
    
    // Persist to AsyncStorage
    try {
      await Promise.all([
        AsyncStorage.setItem(TODAY_PUFFS_KEY, newPuffCount.toString()),
        AsyncStorage.setItem(LAST_PUFF_TIME_KEY, now.toISOString()),
        AsyncStorage.setItem(TODAY_DATE_KEY, now.toDateString()),
      ]);
    } catch (error) {
      console.error("Error saving to AsyncStorage:", error);
    }

    // Save to Supabase
    if (user?.id) {
      try {
        const { error } = await supabase.from("puffs").insert({
          user_id: user.id,
          timestamp: now.toISOString(),
          count: 1,
        });
        
        if (error) {
          console.error("Error saving puff to Supabase:", error);
        }
      } catch (error) {
        console.error("Error inserting puff:", error);
      }
    }
  }, [todayPuffs, user?.id]);

  return {
    firstName,
    dailyGoal,
    todayPuffs,
    percentage,
    timeSinceLastPuff: getTimeSinceLastPuff(),
    lastPuffTime,
    motivationalMessage,
    currentWeek,
    addPuff,
    loading: profileLoading,
  };
}
