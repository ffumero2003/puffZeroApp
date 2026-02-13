import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const colors = useThemeColors();

  return (
    <ScreenWrapper>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
    </ScreenWrapper>
  );
}
