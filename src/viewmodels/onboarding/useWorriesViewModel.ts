// useWorriesViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useWorriesViewModel() {
  const { setWorries } = useOnboarding();

  function submitWorries(worries: string[]) {
  if (!worries || worries.length === 0) return false;
  setWorries(worries);
  return true;
}


  return {
    submitWorries,
  };
}
