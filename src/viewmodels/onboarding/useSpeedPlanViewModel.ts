import { useOnboarding } from "@/src/providers/onboarding-provider";
import { router } from "expo-router";

export function useSpeedPlanViewModel() {
  const { setGoalSpeed } = useOnboarding();

  function continueWithSpeed(speed: string) {
    setGoalSpeed(speed);
    router.push("/onboarding-motivation");
  }

  return {
    continueWithSpeed,
  };
}
