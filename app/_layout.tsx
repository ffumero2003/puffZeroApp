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

import Splash from "../src/components/system/splash";
import { AuthProvider, useAuth } from "../src/providers/auth-provider";
import { OnboardingProvider, useOnboarding } from "../src/providers/onboarding-provider";

// 👉 NECESARIO para PKCE + expo-web-browser
WebBrowser.maybeCompleteAuthSession();

function RootNavigation() {
  const { user, initializing, authInProgress, authFlow } = useAuth();
  const { loading } = useOnboarding();
  const segments = useSegments();

  // 🟣 Importar DEV_MODE
  const { DEV_MODE, DEV_SCREEN } = require("../src/config/dev");

  const isLoading = initializing || loading;


  useEffect(() => {
    if (DEV_MODE) {
      router.replace(DEV_SCREEN);
      return;
    }

    if (authInProgress || isLoading) return;

    const [group] = segments;

    /**
     * 🔒 RESET PASSWORD RULE
     * --------------------------------------------------
     * reset-password SOLO es válido si existe sesión.
     * Si no hay user, se expulsa inmediatamente.
     * --------------------------------------------------
     */
    if (group === "reset-password") {
      if (!user) {
        router.replace("/(onboarding)/onboarding"); // o ROUTES.LOGIN
      }
      return;
    }

    /**
     * 🚪 USUARIO NO AUTENTICADO
     * --------------------------------------------------
     * Solo puede estar en (auth) o (onboarding)
     * --------------------------------------------------
     */
    if (!user) {
      if (group !== "(auth)" && group !== "(onboarding)") {
        router.replace("/(onboarding)/onboarding");
      }
      return;
    }

    /**
     * 🏠 USUARIO AUTENTICADO
     * --------------------------------------------------
     * No debe volver a auth ni onboarding
     * --------------------------------------------------
     */
    if (group === "(auth)" || group === "(onboarding)") {
      router.replace("/(app)/home");
      return;
    }

    // Usuario autenticado y ya en (app) → OK
  }, [authInProgress, isLoading, user, segments]);



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
