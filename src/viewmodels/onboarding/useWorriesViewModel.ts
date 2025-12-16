// useWorriesViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useWorriesViewModel() {
  const { setWorries } = useOnboarding();

  function submitWorries(worries: string[]) {
    setWorries(worries);
    return true;
  }

  return {
    submitWorries,
  };
}
