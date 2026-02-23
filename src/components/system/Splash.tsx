// src/components/system/Splash.tsx
import { useThemeColors } from "@/src/providers/theme-provider";
import { ActivityIndicator, View } from "react-native";

export default function Splash() {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
