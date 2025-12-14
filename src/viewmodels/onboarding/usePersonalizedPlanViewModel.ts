import { useOnboarding } from "@/src/providers/onboarding-provider";
import { buildPuffsPlan, sampleChartData } from "@/src/utils/charts";
import { router } from "expo-router";
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

export function usePersonalizedPlanViewModel() {
  const {
    goal_speed,
    profile_created_at,
    puffs_per_day,
    resetAll,
  } = useOnboarding();

  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [puffsChart, setPuffsChart] = useState<number[]>([]);

  useEffect(() => {
    if (!goal_speed || !profile_created_at) {
      router.replace("/(onboarding)/post-signup/step-review");
      return;
    }

    const days = Number(goal_speed);
    if (Number.isNaN(days)) {
      router.replace("/(onboarding)/post-signup/step-review");
      return;
    }

    setTargetDate(formatDate(getTargetDate(profile_created_at, days)));

    if (puffs_per_day && days > 0) {
      const fullPlan = buildPuffsPlan(puffs_per_day, days);
      setPuffsChart(sampleChartData(fullPlan, 12));
    }
  }, []);

  function continueFlow() {
    resetAll();
    router.push("/(onboarding)/post-signup/step-facts");
  }

  return {
    targetDate,
    puffsChart,
    continueFlow,
  };
}
