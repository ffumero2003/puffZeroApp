// src/services/notification-service.ts
import { updateProfile } from "@/src/lib/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Storage keys
const PUSH_TOKEN_KEY = "expo_push_token";
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";

// Lazy load expo-notifications to prevent import crashes
let Notifications: typeof import("expo-notifications") | null = null;
let Constants: typeof import("expo-constants").default | null = null;

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

/**
 * Save push token to user's profile in the database
 * Call this after login/register to ensure the token is always up to date
 * Will register for push notifications if no token exists
 */
export async function savePushTokenToProfile(userId: string): Promise<void> {
  if (!userId) {
    console.log("⚠️ savePushTokenToProfile: No userId provided");
    return;
  }

  try {
    // First try to get stored token
    let pushToken = await getStoredPushToken();
    
    // If no token stored, register for push notifications
    if (!pushToken) {
      console.log("📲 No push token stored, registering for notifications...");
      pushToken = await registerForPushNotifications();
    }
    
    if (!pushToken) {
      console.log("⚠️ savePushTokenToProfile: Could not get push token");
      return;
    }

    const { error } = await updateProfile(userId, { push_token: pushToken });
    
    if (error) {
      console.log("❌ Error saving push token to profile:", error);
    } else {
      console.log("✅ Push token saved to profile");
    }
  } catch (error) {
    console.log("⚠️ Error in savePushTokenToProfile:", error);
  }
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

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "🧪 Test Notification",
        body: "¡Las notificaciones están funcionando correctamente!",
      },
      trigger: {
        type: "timeInterval",
        seconds: 2,
      } as any,
    });
    console.log("✅ Test notification scheduled");
  } catch (error) {
    console.log("❌ Error sending test notification:", error);
  }
}










