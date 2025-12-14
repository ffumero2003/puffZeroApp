import { useOnboarding } from "@/src/providers/onboarding-provider";
import { router } from "expo-router";

export function usePuffsViewModel() {
  const { setPuffs } = useOnboarding();

  function continueWithPuffs(value: number) {
    setPuffs(value);
    router.push("/onboarding-money-spent");
  }

  function isValidPuffs(value: number) {
    return value >= 20;
  }

  return {
    continueWithPuffs,
    isValidPuffs,
  };
}
