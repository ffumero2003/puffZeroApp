// useGoalViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useGoalViewModel() {
  const { setGoal } = useOnboarding();

  function submitGoal(goal: string) {
  if (!goal) return false;
  setGoal(goal);
  return true;
}


  return {
    submitGoal,
  };
}
