// useMotivationViewModel.ts
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useMotivationViewModel() {
  const { setWhyStopped } = useOnboarding();

  function submitMotivation(id: string) {
  if (!id) return false;
  setWhyStopped([id]);
  return true;
}


  return {
    submitMotivation,
  };
}
