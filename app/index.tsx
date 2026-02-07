// app/index.tsx
import { getInitialRoute, isDevMode } from "@/src/config/dev";
import { Redirect } from "expo-router";
import { View } from "react-native";

export default function Index() {
  // Dev mode: go to the configured screen directly
  if (isDevMode()) {
    const devRoute = getInitialRoute();
    if (devRoute) {
      return <Redirect href={devRoute as any} />;
    }
  }

  // Return an empty view — AuthGuard in _layout.tsx handles all routing
  // (it checks session state and redirects to onboarding, home, or paywall)
  return <View />;
}
