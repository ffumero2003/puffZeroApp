import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { Stack } from "expo-router";

export default function PaywallLayout() {
  return (
    <ScreenWrapper>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
    </ScreenWrapper>
  );
}
