import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export function useNotificationsViewModel() {
  async function requestPermissionAndContinue() {
    try {
      await Notifications.requestPermissionsAsync();
    } catch (e) {
      // no importa el error, seguimos
    } finally {
      router.push("/(onboarding)/post-signup/step-percentage");
    }
  }

  function skipPermission() {
    router.push("/(onboarding)/post-signup/step-percentage");
  }

  return {
    requestPermissionAndContinue,
    skipPermission,
  };
}
