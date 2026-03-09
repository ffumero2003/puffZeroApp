// usePersonalizedPlanViewModel.ts
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { areNotificationsEnabled } from "@/src/services/notifications/notification-service";
import { sendWelcomeNotification } from "@/src/services/notifications/welcome-notification";
import { buildPuffsPlan, sampleChartData } from "@/src/utils/charts";
import { useEffect, useState } from "react";

function getTargetDate(createdAt: string, goalSpeed: number): Date {
  const start = new Date(createdAt);
  const target = new Date(start);
  target.setDate(start.getDate() + goalSpeed);
  return target;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export type PersonalizedPlanStatus = "loading" | "ok" | "invalid";

export function usePersonalizedPlanViewModel() {
  const {
    goal_speed,
    profile_created_at,
    puffs_per_day,
    setGoalSpeed,
    setPuffs,
    setProfileCreatedAt,
  } = useOnboarding();
  const { user } = useAuth();

  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [puffsChart, setPuffsChart] = useState<number[]>([]);
  const [status, setStatus] = useState<PersonalizedPlanStatus>("loading");

  // Fallback: fetch from Supabase if local state is missing
  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      let speed = goal_speed;
      let createdAt = profile_created_at;
      let puffs = puffs_per_day;

      // If local data is missing, try Supabase
      if ((!speed || !createdAt) && user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("goal_speed, puffs_per_day, created_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cancelled) return;

        if (profile) {
          if (!speed && profile.goal_speed) {
            speed = profile.goal_speed;
            setGoalSpeed(profile.goal_speed);
          }
          if (!createdAt && profile.created_at) {
            createdAt = profile.created_at;
            setProfileCreatedAt(profile.created_at);
          }
          if (!puffs && profile.puffs_per_day) {
            puffs = profile.puffs_per_day;
            setPuffs(profile.puffs_per_day);
          }
        }
      }

      if (cancelled) return;

      if (!speed || !createdAt) {
        setStatus("invalid");
        return;
      }

      const days = Number(speed);
      if (Number.isNaN(days)) {
        setStatus("invalid");
        return;
      }

      setTargetDate(formatDate(getTargetDate(createdAt, days)));

      if (puffs && days > 0) {
        const fullPlan = buildPuffsPlan(puffs, days);
        setPuffsChart(sampleChartData(fullPlan, 12));
      }

      setStatus("ok");
    }

    resolve();
    return () => { cancelled = true; };
  }, [goal_speed, profile_created_at, puffs_per_day, user?.id]);

  // Send welcome notification when personalized plan screen mounts
  useEffect(() => {
    async function handleWelcomeNotification() {
      try {
        const notificationsEnabled = await areNotificationsEnabled();
        if (!notificationsEnabled) return;
        await sendWelcomeNotification();
      } catch (error) {
        console.error("Error sending welcome notification:", error);
      }
    }
    handleWelcomeNotification();
  }, []);

  function finishFlow() {
    if (status !== "ok") return false;
    return true;
  }

  return {
    targetDate,
    puffsChart,
    status,
    finishFlow,
  };
}
