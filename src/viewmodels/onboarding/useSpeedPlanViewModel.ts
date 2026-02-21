// useSpeedPlanViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useSpeedPlanViewModel() {
  const { setGoalSpeed } = useOnboarding();

  function submitSpeed(speed: string) {
  if (!speed) return false;
  setGoalSpeed(speed);
  return true;
}


  return {
    submitSpeed,
  };
}
