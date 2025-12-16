// useGoalViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useGoalViewModel() {
  const { setGoal } = useOnboarding();

  function submitGoal(goal: string) {
    setGoal(goal);
    return true; // señal, NO navegación
  }

  return {
    submitGoal,
  };
}
