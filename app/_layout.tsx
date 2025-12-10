import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";

import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/providers/auth-provider";
import { OnboardingProvider, useOnboarding } from "../src/providers/onboarding-provider";
import Splash from "../src/screens/splash";


function RootNavigation() {
    const { user, initializing } = useAuth();
    const { onboardingCompleted, loading } = useOnboarding();
    const segments = useSegments();

    const isLoading = initializing || loading;

    const group = segments[0];
    const inAuth = group === "(auth)";
    const inOnboarding = group === "(onboarding)";
    const inApp = group === "(app)";

    // 🔥 Toda la navegación controlada aquí
    useEffect(() => {
      if (isLoading) return;

      // 1️⃣ SIN SESIÓN → onboarding o auth
      if (!user) {
        if (!inOnboarding && !inAuth) {
          router.replace("/(onboarding)/onboarding");
        }
        return;
      }

      // 2️⃣ CON SESIÓN pero SIN post-signup
      if (!onboardingCompleted) {
        if (!inOnboarding) {
          router.replace("/(onboarding)/post-signup/step1");
        }
        return;
      }

      // 3️⃣ COMPLETO TODO → HOME
      if (!inApp) {
        router.replace("/(app)/home");
      }
    }, [isLoading, user, onboardingCompleted, segments]);

    // 🔵 UI normal SIEMPRE se retorna aquí, NUNCA en useEffect
    if (isLoading) return <Splash />;

    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
          animationDuration: 250,
        }}
      />
    );
  }





export default function RootLayout() {
  const [loaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
      <OnboardingProvider>
        <StatusBar style="dark" />
        <RootNavigation />
      </OnboardingProvider>
    </AuthProvider>
  );
}
