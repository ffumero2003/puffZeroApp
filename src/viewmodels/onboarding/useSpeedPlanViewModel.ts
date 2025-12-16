// useSpeedPlanViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useSpeedPlanViewModel() {
  const { setGoalSpeed } = useOnboarding();

  function submitSpeed(speed: string) {
    setGoalSpeed(speed);
    return true;
  }

  return {
    submitSpeed,
  };
}
