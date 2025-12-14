import { useOnboarding } from "@/src/providers/onboarding-provider";
import { router } from "expo-router";

export function useWorriesViewModel() {
  const { setWorries } = useOnboarding();

  function continueWithWorries(worries: string[]) {
    setWorries(worries);
    router.push("/(auth)/registrarse");
  }

  return {
    continueWithWorries,
  };
}
