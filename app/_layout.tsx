import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";

import * as Linking from "expo-linking";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider } from "../src/providers/auth-provider";
import { OnboardingProvider } from "../src/providers/onboarding-provider";

export default function RootLayout() {
  const [loaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    // Escucha enlaces tipo puffzero://reset-password
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link recibido:", url);

      if (url.startsWith("puffzero://reset-password")) {
        router.push("/reset-password");
      }
    });

    // Captura el caso de cuando la app se abre desde cero por un deep link
    Linking.getInitialURL().then((url) => {
      if (url && url.startsWith("puffzero://reset-password")) {
        router.push("/reset-password");
      }
    });

    return () => subscription.remove();
  }, []);

  if (!loaded) return null;

  return (
    <AuthProvider>
      <OnboardingProvider>

        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            animationDuration: 250,
            animationTypeForReplace: "push",
          }}
        />

      </OnboardingProvider>
    </AuthProvider>
  );
}
