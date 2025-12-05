import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // 👈 ESTA ES LA MAGIA
        gestureEnabled: true, // permite swipe back
        animationDuration: 250,
      }}
    />
  );
}
