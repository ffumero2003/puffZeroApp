// src/viewmodels/app/useHomeViewModel.ts
import { useUserData } from "@/src/hooks/useUserData";
import { updateProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { fetchAIQuote } from "@/src/services/ai-quotes-service";
import { scheduleDailyAchievementCheck } from "@/src/services/notifications/daily-achievement-notification";
import { updateLastActivity } from "@/src/services/notifications/inactivity-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

// Keys are now scoped per user so switching accounts doesn't show stale data
const getStorageKeys = (userId: string) => ({
  lastPuffTime: `lastPuffTime_${userId}`,
  todayPuffs: `todayPuffs_${userId}`,
  todayDate: `todayDate_${userId}`,
});


export type DayPuffs = {
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
  const { profile, loading: profileLoading, refreshProfile } = useUserData();

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile])
  );

  
  const [todayPuffs, setTodayPuffs] = useState(0);
  const [lastPuffTime, setLastPuffTime] = useState<Date | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [currentWeek, setCurrentWeek] = useState<WeekData | null>(null);
  const [puffsLoading, setPuffsLoading] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(true);

    // ─── Plan completion state ───
  const [showPlanCompleted, setShowPlanCompleted] = useState(false);
  const [planIsSuccess, setPlanIsSuccess] = useState(false);
  const { profile_created_at, goal_speed, setGoalSpeed, setProfileCreatedAt } = useOnboarding();

  // ─── Relapse modal state ───
  const [showRelapseModal, setShowRelapseModal] = useState(false);


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
        // Schedule tonight's notification starting at 0 puffs
        scheduleDailyAchievementCheck(0, profile?.puffs_per_day || 200);
      } else if (storedTodayPuffs) {
      setTodayPuffs(parseInt(storedTodayPuffs, 10));
      // Schedule tonight's 11:59 PM notification with current puff data on app open
      scheduleDailyAchievementCheck(parseInt(storedTodayPuffs, 10), profile?.puffs_per_day || 200);
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


  // Generate current week data — now fetches historical puffs from Supabase
const generateCurrentWeek = useCallback(async () => {
  const today = new Date();
  
  // Get start of current week (Sunday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0); // start of day
  
  // End of week (Saturday 23:59:59)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  // --- Fetch this week's puffs from Supabase ---
  const puffsByDate: Record<string, number> = {};
  
  if (user?.id) {
    try {
      const { data, error } = await supabase
        .from("puffs")
        .select("timestamp, count")
        .eq("user_id", user.id)
        .gte("timestamp", weekStart.toISOString())
        .lte("timestamp", weekEnd.toISOString());
      
      if (!error && data) {
        // Aggregate puff counts by date string (e.g. "Mon Feb 03 2026")
        for (const puff of data) {
          const dateKey = new Date(puff.timestamp).toDateString();
          puffsByDate[dateKey] = (puffsByDate[dateKey] || 0) + (puff.count || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching week puffs:", error);
    }
  }
  
  const days: DayPuffs[] = [];
  const dayNames = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"];
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(weekStart.getDate() + i);
    
    const isToday = currentDay.toDateString() === today.toDateString();
    const dateKey = currentDay.toDateString();
    
    days.push({
      date: currentDay.toISOString(),
      day: dayNames[i],
      // For today: use local state (most up-to-date); for other days: use Supabase data
      puffs: isToday ? todayPuffs : (puffsByDate[dateKey] || 0),
      isToday,
    });
  }
  
  const weekLabel = `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('es-ES', { month: 'long' })}, ${weekStart.getFullYear()}`;
  
  setCurrentWeek({ weekLabel, days });
}, [todayPuffs, user?.id]); // added user?.id as dependency since we now query Supabase


  // Load AI-generated motivational message
  const loadMotivationalMessage = useCallback(async () => {
  setQuoteLoading(true);
  const quote = await fetchAIQuote({
    percentage,
  });
  setMotivationalMessage(quote);
  setQuoteLoading(false);
}, [percentage]);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  // Generate week when todayPuffs changes
  useEffect(() => {
    generateCurrentWeek();
  }, [generateCurrentWeek]);

      // ─── Check if the user's plan timer has expired ───
  useEffect(() => {
    if (!user?.id || !profile) return;

    const createdAt = profile_created_at || profile.plan_started_at || profile.created_at;

    const speed = goal_speed || profile.goal_speed;
    if (!createdAt || !speed) return;

    const goalDays = parseInt(speed, 10);
    const endTime = new Date(createdAt).getTime() + goalDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    // Timer hasn't expired yet — do nothing
    if (now < endTime) return;

    // Check if user already dismissed this (so we don't show it every app open)
    const checkDismissed = async () => {
      const dismissedAt = await AsyncStorage.getItem(`plan_completed_dismissed_${user.id}`);
      if (dismissedAt) {
        // "forever" = user succeeded and dismissed — never show again
        if (dismissedAt === "forever") return;

        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
        // If less than 3 days since last dismiss, don't show again yet
        if (elapsed < threeDaysMs) return;
      }

      // Timer expired — check last 3 days of puffs to determine success
      try {
        const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from("puffs")
          .select("count")
          .eq("user_id", user.id)
          .gte("timestamp", threeDaysAgo);

        if (error) {
          console.error("Error checking plan completion:", error);
          return;
        }

        // Sum up all puffs in the last 3 days
        const totalPuffs = (data || []).reduce((sum, p) => sum + (p.count || 0), 0);

        // Success = 0 puffs in last 3 days
        setPlanIsSuccess(totalPuffs === 0);
        setShowPlanCompleted(true);
      } catch (error) {
        console.error("Error checking plan completion:", error);
      }
    };

    checkDismissed();
  }, [user?.id, profile, profile_created_at, goal_speed]);


    // ─── Handle dismissing the plan completed modal ───
  const dismissPlanCompleted = useCallback(async () => {
    setShowPlanCompleted(false);
    if (user?.id) {
      if (planIsSuccess) {
        // Success: user quit — never show the plan-completed modal again
        // (but if they add a puff, the relapse modal will trigger instead)
        await AsyncStorage.setItem(
          `plan_completed_dismissed_${user.id}`,
          "forever"
        );
      } else {
        // Retry: user still vaping — show again in 3 days
        await AsyncStorage.setItem(
          `plan_completed_dismissed_${user.id}`,
          Date.now().toString()
        );
      }
    }
  }, [user?.id, planIsSuccess]);

  // ─── Handle selecting a new plan (retry flow) ───
  const selectNewPlan = useCallback(async (newGoalSpeed: string) => {
    if (!user?.id) return;

    const now = new Date().toISOString();

    try {
      // Update goal_speed AND plan_started_at in Supabase — survives reinstall
      await updateProfile(user.id, {
        goal_speed: newGoalSpeed,
        plan_started_at: now,
      });

      // Store the new plan start date locally — this is what the countdown reads
      setGoalSpeed(newGoalSpeed);
      await setProfileCreatedAt(now);

      // Clear the dismissed flag so future completions trigger the modal again
      await AsyncStorage.removeItem(`plan_completed_dismissed_${user.id}`);

      // Close the modal
      setShowPlanCompleted(false);
    } catch (error) {
      console.error("Error setting new plan:", error);
    }
  }, [user?.id]);


    // ─── Handle dismissing the relapse modal without choosing a plan ───
  const dismissRelapseModal = useCallback(async () => {
    setShowRelapseModal(false);
    // Clear the "forever" flag so the relapse modal doesn't show on every puff
    // Set it to a timestamp instead — it will re-check via the plan completion logic
    if (user?.id) {
      await AsyncStorage.setItem(
        `plan_completed_dismissed_${user.id}`,
        Date.now().toString()
      );
    }
  }, [user?.id]);

  // ─── Handle selecting a new plan from the relapse modal ───
  const selectNewPlanFromRelapse = useCallback(async (newGoalSpeed: string) => {
    setShowRelapseModal(false);
    await selectNewPlan(newGoalSpeed);
  }, [selectNewPlan]);




  // Load motivational message on mount and when profile loads
  useEffect(() => {
    if (!profileLoading) {
      loadMotivationalMessage();
    }
  }, [profileLoading]);



    const addPuff = useCallback(async () => {
      if (!user?.id) return;

      const keys = getStorageKeys(user.id);
      const now = new Date();
      const newPuffCount = todayPuffs + 1;

      // Update state immediately for UI responsiveness
      setTodayPuffs(newPuffCount);
      setLastPuffTime(now);

      // Check if this user previously completed their plan successfully
      // If so, show the relapse modal (only on the first puff after success)
      const dismissed = await AsyncStorage.getItem(`plan_completed_dismissed_${user.id}`);
      if (dismissed === "forever") {
        setShowRelapseModal(true);
      }

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

      scheduleDailyAchievementCheck(newPuffCount, dailyGoal);

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
    loading: profileLoading || puffsLoading || quoteLoading,
    showPlanCompleted,
    planIsSuccess,
    dismissPlanCompleted,
    selectNewPlan,
    // Relapse modal
    showRelapseModal,
    dismissRelapseModal,
    selectNewPlanFromRelapse,
  };



}
