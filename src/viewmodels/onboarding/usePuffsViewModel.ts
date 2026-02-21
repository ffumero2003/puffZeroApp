// usePuffsViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function usePuffsViewModel() {
  const { setPuffs } = useOnboarding();

  function submitPuffs(value: number) {
  if (!isValidPuffs(value)) return false;
  setPuffs(value);
  return true;
}


  function isValidPuffs(value: number) {
    return value >= 20;
  }

  return {
    submitPuffs,
    isValidPuffs,
  };
}
