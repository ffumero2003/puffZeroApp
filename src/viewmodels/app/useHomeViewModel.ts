// src/viewmodels/app/useHomeViewModel.ts
import { useUserData } from "@/src/hooks/useUserData";
import { useAuth } from "@/src/providers/auth-provider";
import { fetchAIQuote } from "@/src/services/ai-quotes-service";
import { useEffect, useState } from "react";

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
  
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [todayPuffs, setTodayPuffs] = useState(0);
  const [lastPuffTime, setLastPuffTime] = useState<Date | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [weeks, setWeeks] = useState<WeekData[]>([]);

  // Get first name from user
  const getFirstName = () => {
    const fullName = profile?.full_name || user?.user_metadata?.full_name || "Usuario";
    return fullName.trim().split(" ")[0];
  };

  // Get daily goal
  const dailyGoal = profile?.puffs_per_day || 200;

  // Calculate percentage
  const percentage = Math.min(Math.round((todayPuffs / dailyGoal) * 100), 100);

  // Get time since last puff
  const getTimeSinceLastPuff = () => {
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
  };

  // Generate weeks data
  const generateWeeks = () => {
    const weeksData: WeekData[] = [];
    const today = new Date();
    
    // Generate 8 weeks (current + 7 past)
    for (let weekOffset = 0; weekOffset < 8; weekOffset++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() - (weekOffset * 7));
      
      const days: DayPuffs[] = [];
      const dayNames = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vie", "Sab"];
      
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + i);
        
        const isToday = currentDay.toDateString() === today.toDateString();
        
        days.push({
          date: currentDay.toISOString(),
          day: dayNames[i],
          puffs: isToday ? todayPuffs : 0, // TODO: Load from DB
          isToday,
        });
      }
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekLabel = `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('es-ES', { month: 'long' })}, ${weekStart.getFullYear()}`;
      
      weeksData.push({ weekLabel, days });
    }
    
    setWeeks(weeksData);
  };

  // Load AI-generated motivational message
  const loadMotivationalMessage = async () => {
    const quote = await fetchAIQuote({
      firstName: getFirstName(),
      dailyGoal,
      todayPuffs,
      percentage,
    });
    setMotivationalMessage(quote);
  };

  useEffect(() => {
    generateWeeks();
    loadMotivationalMessage();
  }, []);

  // Reload quote when puffs change significantly (every 5 puffs or when reaching limits)
  useEffect(() => {
    if (todayPuffs > 0 && (todayPuffs % 5 === 0 || todayPuffs === dailyGoal)) {
      loadMotivationalMessage();
    }
  }, [todayPuffs]);

  const addPuff = () => {
    setTodayPuffs(prev => prev + 1);
    setLastPuffTime(new Date());
    // TODO: Save to database
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(prev => prev + 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(prev => prev - 1);
    }
  };

  return {
    firstName: getFirstName(),
    dailyGoal,
    todayPuffs,
    percentage,
    timeSinceLastPuff: getTimeSinceLastPuff(),
    motivationalMessage,
    currentWeek: weeks[currentWeekIndex],
    canGoBack: currentWeekIndex < weeks.length - 1,
    canGoForward: currentWeekIndex > 0,
    addPuff,
    goToPreviousWeek,
    goToNextWeek,
    loading: profileLoading,
  };
}