// src/viewmodels/app/useHomeViewModel.ts
import { useUserData } from "@/src/hooks/useUserData";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { fetchAIQuote } from "@/src/services/ai-quotes-service";
import { updateLastActivity } from "@/src/services/notifications/inactivity-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

// Keys are now scoped per user so switching accounts doesn't show stale data
const getStorageKeys = (userId: string) => ({
  lastPuffTime: `lastPuffTime_${userId}`,
  todayPuffs: `todayPuffs_${userId}`,
  todayDate: `todayDate_${userId}`,
});


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
  const [puffsLoading, setPuffsLoading] = useState(true);



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

  const loadPersistedData = useCallback(async () => {
  // Skip if no user logged in — keys require a userId
  if (!user?.id) return;

  const keys = getStorageKeys(user.id);

  try {
    const [storedLastPuff, storedTodayPuffs, storedDate] = await Promise.all([
      AsyncStorage.getItem(keys.lastPuffTime),
      AsyncStorage.getItem(keys.todayPuffs),
      AsyncStorage.getItem(keys.todayDate),
    ]);

    const today = new Date().toDateString();
    if (storedDate !== today) {
      await AsyncStorage.setItem(keys.todayDate, today);
      await AsyncStorage.setItem(keys.todayPuffs, "0");
      setTodayPuffs(0);
    } else if (storedTodayPuffs) {
      setTodayPuffs(parseInt(storedTodayPuffs, 10));
    }

    if (storedLastPuff) {
      setLastPuffTime(new Date(storedLastPuff));
    }

    const { data } = await supabase
      .from("puffs")
      .select("timestamp")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.timestamp) {
      const supabaseLastPuff = new Date(data.timestamp);
      if (!storedLastPuff || supabaseLastPuff > new Date(storedLastPuff)) {
        setLastPuffTime(supabaseLastPuff);
        await AsyncStorage.setItem(keys.lastPuffTime, supabaseLastPuff.toISOString());
      }
    }
  } catch (error) {
    console.error("Error loading persisted data:", error);
  } finally {
    // Mark puffs data as loaded regardless of success/failure
    setPuffsLoading(false);
  }
}, [user?.id]);


  // Generate current week data only
  const generateCurrentWeek = useCallback(() => {
    const today = new Date();
    
    // Get start of current week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const days: DayPuffs[] = [];
    const dayNames = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"];
    
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

  //   // Send welcome notification once when user first lands on Home
  // useEffect(() => {
  //   async function handleWelcomeNotification() {
  //     try {
  //       // Check if we already sent the welcome notification
  //       const alreadySent = await AsyncStorage.getItem("welcomeNotificationSent");
  //       if (alreadySent) return;

  //       const notificationsEnabled = await areNotificationsEnabled();
  //       if (!notificationsEnabled) return;

  //       await sendWelcomeNotification();
  //       await AsyncStorage.setItem("welcomeNotificationSent", "true");
  //     } catch (error) {
  //       console.error("Error sending welcome notification:", error);
  //     }
  //   }

  //   handleWelcomeNotification();
  // }, []); // Runs once on mount

    // Send welcome notification every time user enters Home (TESTING)
  // useEffect(() => {
  //   async function handleWelcomeNotification() {
  //     try {
  //       // Skip areNotificationsEnabled check — it's never set during onboarding
  //       await sendWelcomeNotification();
  //     } catch (error) {
  //       console.error("Error sending welcome notification:", error);
  //     }
  //   }

  //   handleWelcomeNotification();
  // }, []);




  const addPuff = useCallback(async () => {
  if (!user?.id) return;

  const keys = getStorageKeys(user.id);
  const now = new Date();
  const newPuffCount = todayPuffs + 1;

  // Update state immediately for UI responsiveness
  setTodayPuffs(newPuffCount);
  setLastPuffTime(now);

  // Persist to AsyncStorage (now user-scoped)
  try {
    await Promise.all([
      AsyncStorage.setItem(keys.todayPuffs, newPuffCount.toString()),
      AsyncStorage.setItem(keys.lastPuffTime, now.toISOString()),
      AsyncStorage.setItem(keys.todayDate, now.toDateString()),
    ]);
  } catch (error) {
    console.error("Error saving to AsyncStorage:", error);
  }

  // Save to Supabase
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

  await updateLastActivity();
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
  // Home is ready only when BOTH profile and puffs data have loaded
  loading: profileLoading || puffsLoading,
};

}
