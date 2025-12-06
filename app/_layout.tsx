import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/providers/authProvider";
import { OnboardingProvider } from "../src/providers/onboardingProvider";

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
