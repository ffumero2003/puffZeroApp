import { getInitialRoute, isDevMode } from "@/src/config/dev";
import { Redirect } from "expo-router";

export default function Index() {
  if (isDevMode()) {
    const devRoute = getInitialRoute();
    if (devRoute) {
      return <Redirect href={devRoute as any} />;
    }
  }
  return <Redirect href="/(onboarding)/onboarding" />;
}
