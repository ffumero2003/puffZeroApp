import { useThemeColors } from "@/src/providers/theme-provider";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}