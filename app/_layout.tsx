// app/_layout.tsx
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,

  useFonts,
} from "@expo-google-fonts/manrope";

import { useAuthGuard } from "@/src/guards/AuthGuard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Splash from "../src/components/system/splash";
import { supabase } from "../src/lib/supabase";
import { AuthProvider, useAuth } from "../src/providers/auth-provider";
import { OnboardingProvider } from "../src/providers/onboarding-provider";

WebBrowser.maybeCompleteAuthSession();

function RootNavigation() {
  const { initializing } = useAuth();
  
  // 🔥 TODO EL FLUJO EN UN SOLO LUGAR
  useAuthGuard();

  useEffect(() => {
    const resetAll = async () => {
      console.log("🧨 Limpiando todo...");
      await supabase.auth.signOut();
      await AsyncStorage.clear();
      router.replace("/(onboarding)/onboarding");
    };
    
    // 🔥 DESCOMENTAR ESTA LÍNEA PARA HACER RESET:
    // resetAll();
  }, []);


  if (initializing) return <Splash />;

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
    <SafeAreaProvider>
      <AuthProvider>
        <OnboardingProvider>
          <StatusBar style="dark" />
            <RootNavigation />
          </OnboardingProvider>
        </AuthProvider>
    </SafeAreaProvider>
    
  );
}