// src/services/notification-service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Storage keys
const PUSH_TOKEN_KEY = "expo_push_token";
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";

// Configure notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Check if running on a physical device
 */
function isPhysicalDevice(): boolean {
  // expo-constants provides device info without needing expo-device
  return !__DEV__ || Platform.OS === "android" || Platform.OS === "ios";
}

/**
 * Request notification permissions and get push token
 */
export async function registerForPushNotifications(): Promise<string | null> {
  let token: string | null = null;

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Notification permission denied");
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
    return null;
  }

  // Mark notifications as enabled
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "true");

  // Get Expo push token (only works on physical devices)
  try {
    // Get project ID from expo-constants
    const projectId = Constants.expoConfig?.extra?.eas?.projectId 
      ?? Constants.easConfig?.projectId;
    
    if (projectId) {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      token = tokenData.data;
      console.log("✅ Push token obtained:", token);
      
      // Store token locally
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    } else {
      console.log("⚠️ No projectId found, skipping push token registration");
    }
  } catch (error) {
    console.log("⚠️ Could not get push token (may be on simulator):", error);
  }

  // Android specific channel setup
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "PuffZero Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#5974FF",
    });

    await Notifications.setNotificationChannelAsync("daily-quotes", {
      name: "Frases Diarias",
      description: "Tu frase motivacional del día",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#5974FF",
    });

    await Notifications.setNotificationChannelAsync("welcome", {
      name: "Bienvenida",
      description: "Notificaciones de bienvenida",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#5974FF",
    });
  }

  return token;
}

/**
 * Get stored push token
 */
export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const enabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  return enabled === "true";
}

// ============================================
// LOCAL NOTIFICATION FUNCTIONS
// ============================================

/**
 * Send welcome notification for new users (registration)
 */
export async function sendWelcomeNotification(): Promise<void> {
  const welcomeMessages = [
    {
      title: "🎉 ¡Bienvenido a PuffZero!",
      body: "Bienvenido a tu nueva vida. Estamos aquí para acompañarte en cada paso.",
    },
    {
      title: "💪 ¡Comenzaste tu viaje!",
      body: "Bienvenido a tu nueva vida sin dependencias. ¡Vamos a lograrlo juntos!",
    },
    {
      title: "🌟 ¡Hola, campeón!",
      body: "Bienvenido a tu nueva vida. Hoy es el primer día de tu mejor versión.",
    },
  ];

  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "welcome", action: "registration" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log("✅ Welcome notification scheduled");
  } catch (error) {
    console.error("❌ Error sending welcome notification:", error);
  }
}

/**
 * Send welcome back notification for returning users (login)
 */
export async function sendWelcomeBackNotification(firstName?: string): Promise<void> {
  const name = firstName ? ` ${firstName}` : "";
  
  const welcomeBackMessages = [
    {
      title: `🔥 ¡Hola de nuevo${name}!`,
      body: "Continúa convirtiéndote en tu mejor versión. Cada día cuenta.",
    },
    {
      title: `💪 ¡Bienvenido de vuelta${name}!`,
      body: "Tu progreso te espera. Sigue adelante con tu plan.",
    },
    {
      title: `🌟 ¡Qué bueno verte${name}!`,
      body: "Estás más cerca de tu meta. No te detengas ahora.",
    },
    {
      title: `⚡ ¡Volviste${name}!`,
      body: "Tu mejor versión te está esperando. ¡Vamos!",
    },
    {
      title: `🎯 ¡Hola${name}!`,
      body: "Cada login es un compromiso contigo. ¡Sigue así!",
    },
  ];

  const randomMessage = welcomeBackMessages[Math.floor(Math.random() * welcomeBackMessages.length)];

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "welcome_back", action: "login" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log("✅ Welcome back notification scheduled");
  } catch (error) {
    console.error("❌ Error sending welcome back notification:", error);
  }
}

/**
 * Send a daily quote notification (called locally or from push)
 */
export async function sendDailyQuoteNotification(quote: string): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💨 Tu frase del día",
        body: quote,
        sound: true,
        data: { type: "daily_quote" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
    console.log("✅ Daily quote notification sent");
  } catch (error) {
    console.error("❌ Error sending daily quote notification:", error);
  }
}

/**
 * Schedule a local daily reminder (fallback if push notifications fail)
 * This schedules a notification for 8 AM local time
 */
export async function scheduleDailyLocalReminder(): Promise<void> {
  // Cancel any existing daily reminders first
  await cancelDailyLocalReminder();

  try {
    // Schedule for 8 AM local time
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💨 Buenos días",
        body: "Recuerda registrar tus puffs y mantener tu progreso.",
        sound: true,
        data: { type: "daily_reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });
    console.log("✅ Daily local reminder scheduled for 8 AM");
  } catch (error) {
    console.error("❌ Error scheduling daily reminder:", error);
  }
}

/**
 * Cancel daily local reminder
 */
export async function cancelDailyLocalReminder(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduled) {
    if (notification.content.data?.type === "daily_reminder") {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("✅ All notifications cancelled");
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}