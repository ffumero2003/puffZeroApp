import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to onboarding - AuthGuard will handle routing from there
  return <Redirect href="/(onboarding)/onboarding" />;
}
