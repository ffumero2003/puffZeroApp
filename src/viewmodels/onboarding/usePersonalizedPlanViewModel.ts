// usePersonalizedPlanViewModel.ts
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

export type PersonalizedPlanStatus = "ok" | "invalid";

export function usePersonalizedPlanViewModel() {
  const {
    goal_speed,
    profile_created_at,
    puffs_per_day,
    
  } = useOnboarding();

  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [puffsChart, setPuffsChart] = useState<number[]>([]);
  const [status, setStatus] = useState<PersonalizedPlanStatus>("ok");

  useEffect(() => {
    if (!goal_speed || !profile_created_at) {
      setStatus("invalid");
      return;
    }

    const days = Number(goal_speed);
    if (Number.isNaN(days)) {
      setStatus("invalid");
      return;
    }

    setTargetDate(formatDate(getTargetDate(profile_created_at, days)));

    if (puffs_per_day && days > 0) {
      const fullPlan = buildPuffsPlan(puffs_per_day, days);
      setPuffsChart(sampleChartData(fullPlan, 12));
    }
  }, [goal_speed, profile_created_at, puffs_per_day]);

  // Send welcome notification when personalized plan screen mounts
  // This runs for both register and login flows
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
    
    return true;
  }

  return {
    targetDate,
    puffsChart,
    status,
    finishFlow,
  };
}
