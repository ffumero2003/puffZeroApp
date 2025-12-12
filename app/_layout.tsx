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
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "../src/providers/auth-provider";
import { OnboardingProvider, useOnboarding } from "../src/providers/onboarding-provider";
import Splash from "../src/screens/splash";

// 👉 NECESARIO para PKCE + expo-web-browser
WebBrowser.maybeCompleteAuthSession();

function RootNavigation() {
  const { user, initializing, authInProgress, authFlow } = useAuth();
  const { loading } = useOnboarding();
  const segments = useSegments();

  // 🟣 Importar DEV_MODE
  const { DEV_MODE, DEV_SCREEN } = require("../src/config/dev");

  const isLoading = initializing || loading;


  // ---------------------------------------
  // 🔥 Lógica de navegación existente
  // ---------------------------------------
  useEffect(() => {
    if (authInProgress || isLoading) return;

    // ❌ No hay sesión → onboarding
    if (!user) {
      router.replace("/(onboarding)/onboarding");
      return;
    }

    // ✅ Hay sesión → home
    router.replace("/(app)/home");
  }, [isLoading, user]);







  if (isLoading && !DEV_MODE) return <Splash />;

  return (
    <>
     
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </>
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
