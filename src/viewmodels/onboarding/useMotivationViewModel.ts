import { useOnboarding } from "@/src/providers/onboarding-provider";
import { router } from "expo-router";

export function useMotivationViewModel() {
  const { setWhyStopped } = useOnboarding();

  function selectMotivation(id: string) {
    setWhyStopped([id]);
    router.push("/onboarding-worries");
  }

  return {
    selectMotivation,
  };
}
