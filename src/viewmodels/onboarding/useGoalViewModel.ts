import { useOnboarding } from "@/src/providers/onboarding-provider";
import { router } from "expo-router";

export function useGoalViewModel() {
  const { setGoal } = useOnboarding();

  function continueWithGoal(goal: string) {
    setGoal(goal);
    router.push("/onboarding-speed-plan");
  }

  return {
    continueWithGoal,
  };
}
