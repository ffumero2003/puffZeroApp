import { Colors } from "@/src/constants/theme";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: Colors.light.background }} 
      edges={["top"]}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}