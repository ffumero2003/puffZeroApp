// src/services/notification-service.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Storage keys
const PUSH_TOKEN_KEY = "expo_push_token";
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";

// Lazy load expo-notifications to prevent import crashes
let Notifications: typeof import("expo-notifications") | null = null;
let Constants: typeof import("expo-constants").default | null = null;

async function getNotifications() {
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

async function getConstants() {
  if (!Constants) {
    try {
      const mod = await import("expo-constants");
      Constants = mod.default;
    } catch (error) {
      console.log("⚠️ expo-constants not available:", error);
      return null;
    }
  }
  return Constants;
}

/**
 * Request notification permissions and get push token
 */
export async function registerForPushNotifications(): Promise<string | null> {
  const Notif = await getNotifications();
  if (!Notif) {
    console.log("⚠️ Notifications not available");
    return null;
  }

  let token: string | null = null;

  try {
    // Check existing permissions
    const { status: existingStatus } = await Notif.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notif.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Notification permission denied");
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
      return null;
    }

    // Mark notifications as enabled
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "true");

    // Get Expo push token
    const Const = await getConstants();
    const projectId = Const?.expoConfig?.extra?.eas?.projectId 
      ?? Const?.easConfig?.projectId;
    
    if (projectId) {
      const tokenData = await Notif.getExpoPushTokenAsync({
        projectId,
      });
      token = tokenData.data;
      console.log("✅ Push token obtained:", token);
      
      // Store token locally
      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    } else {
      console.log("⚠️ No projectId found, skipping push token registration");
    }

    // Android specific channel setup
    if (Platform.OS === "android") {
      await Notif.setNotificationChannelAsync("default", {
        name: "PuffZero Notifications",
        importance: Notif.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#5974FF",
      });

      await Notif.setNotificationChannelAsync("daily-quotes", {
        name: "Frases Diarias",
        description: "Tu frase motivacional del día",
        importance: Notif.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#5974FF",
      });

      await Notif.setNotificationChannelAsync("welcome", {
        name: "Bienvenida",
        description: "Notificaciones de bienvenida",
        importance: Notif.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#5974FF",
      });
    }
  } catch (error) {
    console.log("⚠️ Error in registerForPushNotifications:", error);
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
  const Notif = await getNotifications();
  if (!Notif) return;

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
    await Notif.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "welcome", action: "registration" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
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
  const Notif = await getNotifications();
  if (!Notif) return;

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
    await Notif.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "welcome_back", action: "login" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log("✅ Welcome back notification scheduled");
  } catch (error) {
    console.error("❌ Error sending welcome back notification:", error);
  }
}

/**
 * Send a daily quote notification
 */
export async function sendDailyQuoteNotification(quote: string): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "💨 Tu frase del día",
        body: quote,
        sound: true,
        data: { type: "daily_quote" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
    console.log("✅ Daily quote notification sent");
  } catch (error) {
    console.error("❌ Error sending daily quote notification:", error);
  }
}

/**
 * Schedule a local daily reminder at 8 AM
 */
export async function scheduleDailyLocalReminder(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel any existing daily reminders first
  await cancelDailyLocalReminder();

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "💨 Buenos días",
        body: "Recuerda registrar tus puffs y mantener tu progreso.",
        sound: true,
        data: { type: "daily_reminder" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.DAILY,
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
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduled) {
      if (notification.content.data?.type === "daily_reminder") {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.log("⚠️ Error canceling daily reminder:", error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    await Notif.cancelAllScheduledNotificationsAsync();
    console.log("✅ All notifications cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling notifications:", error);
  }
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications() {
  const Notif = await getNotifications();
  if (!Notif) return [];

  try {
    return Notif.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.log("⚠️ Error getting scheduled notifications:", error);
    return [];
  }
}