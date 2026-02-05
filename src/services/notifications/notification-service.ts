// src/services/notification-service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";


const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";

// Lazy load expo-notifications to prevent import crashes
let Notifications: typeof import("expo-notifications") | null = null;

export async function getNotifications() {
  if (!Notifications) {
    try {
      Notifications = await import("expo-notifications");
      
      // Configure notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          // shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (error) {
      console.log("⚠️ expo-notifications not available:", error);
      return null;
    }
  }
  return Notifications;
}



/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return enabled === "true";
}



/**
 * Send a test notification (for development testing)
 */
export async function sendTestNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) {
    console.log("⚠️ Notifications not available");
    return;
  }

  // try {
  //   await Notif.scheduleNotificationAsync({
  //     content: {
  //       title: "🧪 Test Notification",
  //       body: "¡Las notificaciones están funcionando correctamente!",
  //     },
  //     trigger: {
  //       type: "timeInterval",
  //       seconds: 2,
  //     } as any,
  //   });
  //   console.log("✅ Test notification scheduled");
  // } catch (error) {
  //   console.log("❌ Error sending test notification:", error);
  // }

  await Notif.setNotificationChannelAsync("inactivity", {
    name: "Recordatorios de Inactividad",
    description: "Te recordamos cuando llevas tiempo sin conectar",
    importance: Notif.AndroidImportance.HIGH,
  });

  await Notif.setNotificationChannelAsync("weekly-summary", {
    name: "Resumen Semanal",
    description: "Tu resumen de progreso cada domingo",
    importance: Notif.AndroidImportance.DEFAULT,
  });

  await Notif.setNotificationChannelAsync("achievements", {
    name: "Logros",
    description: "Celebraciones de tus logros",
    importance: Notif.AndroidImportance.HIGH,
  });
}














