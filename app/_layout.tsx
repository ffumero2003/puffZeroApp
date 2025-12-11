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
  const { user, initializing } = useAuth();
  const { onboardingCompleted, loading } = useOnboarding();
  const segments = useSegments();

  // 🟣 Importar DEV_MODE
  const { DEV_MODE, DEV_SCREEN } = require("../src/config/dev");

  const isLoading = initializing || loading;

  useEffect(() => {
    console.log("📡 RootNavigation mounted — setting up deep link listener…");

    // 🔗 Escuchar deep links mientras la app está abierta
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("🔗 Deep link received:", url);

      if (url.startsWith("puffzero://auth/callback")) {
        console.log("🚀 Navigating to /auth/callback (live listener)");
        router.replace("/(auth)/callback");
      }
    });

    // 🔍 Revisar si la app se abrió inicialmente por un deep link
    const checkInitialUrl = async () => {
      const initial = await Linking.getInitialURL();
      if (initial) {
        console.log("🔗 Initial URL:", initial);

        if (initial.startsWith("puffzero://auth/callback")) {
          console.log("🚀 Navigating to /auth/callback (initial URL)");
          router.replace("/(auth)/callback");
        }
      }
    };
    checkInitialUrl();

    return () => sub.remove();
  }, []);

  // ---------------------------------------
  // 🔥 Lógica de navegación existente
  // ---------------------------------------
  useEffect(() => {
    // 🚀 BYPASS ABSOLUTO — si estoy en dev, voy directo a una pantalla
    if (DEV_MODE) {
      router.replace(DEV_SCREEN);
      return;
    }

    if (isLoading) return;

    const group = segments[0];
    const firstSegment = segments[segments.length - 1];

    const inAuth = group === "(auth)";
    const inOnboarding = group === "(onboarding)";
    const inApp = group === "(app)";

    const isPublic = ["privacy-policy", "terms-of-use", "reset-password"].includes(
      firstSegment ?? ""
    );

    if (!user) {
      if (!inAuth && !isPublic) {
        router.replace("/(auth)/login");
      }
      return;
    }

    if (!onboardingCompleted) {
      if (!inOnboarding) {
        router.replace("/(onboarding)/onboarding");
      }
      return;
    }

    if (!inApp) {
      router.replace("/(app)/home");
    }
  }, [isLoading, user, onboardingCompleted, segments]);

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
