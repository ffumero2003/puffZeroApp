// useNotificationsViewModel.ts
import * as Notifications from "expo-notifications";

export function useNotificationsViewModel() {
  async function requestPermission() {
    try {
      await Notifications.requestPermissionsAsync();
    } catch {
      // ignore
    }
    return true;
  }

  function skipPermission() {
    return true;
  }

  return {
    requestPermission,
    skipPermission,
  };
}
