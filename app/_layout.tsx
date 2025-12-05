import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts
} from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";

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
    <Stack
      screenOptions={{
        headerShown: false,

      
        animation: "slide_from_right",

        gestureEnabled: true,

       
        animationDuration: 250,

        animationTypeForReplace: "push",
      }}
    />
  );
}
