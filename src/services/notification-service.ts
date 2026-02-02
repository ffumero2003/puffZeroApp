// src/services/notification-service.ts
import { updateProfile } from "@/src/lib/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Storage keys
const PUSH_TOKEN_KEY = "expo_push_token";
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";
const MILESTONE_NOTIFICATION_KEY = "milestone_notification_sent";

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
 * Cancel daily local reminder (used internally by scheduleDailyLocalReminder)
 */
async function cancelDailyLocalReminder(): Promise<void> {
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
 * Send verification reminder notification
 * Shows at 1.5 days if user hasn't verified
 */
export async function sendVerificationReminderNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  const reminderMessages = [
    {
      title: "⚠️ No pierdas tu progreso",
      body: "Verificá tu email para asegurar que tu progreso se guarde permanentemente.",
    },
    {
      title: "📧 ¿Ya verificaste tu cuenta?",
      body: "Confirmá tu email para no perder todo lo que has logrado.",
    },
    {
      title: "🔐 Protegé tu progreso",
      body: "Verificá tu cuenta para mantener acceso a tu historial y logros.",
    },
  ];

  const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "verification_reminder" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log("✅ Verification reminder notification sent");
  } catch (error) {
    console.error("❌ Error sending verification reminder:", error);
  }
}

/**
 * Schedule verification reminder for 1.5 days from now
 */
export async function scheduleVerificationReminder(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel any existing verification reminders
  await cancelVerificationReminder();

  const REMINDER_HOURS = 36; // 1.5 days = 36 hours

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "⚠️ No pierdas tu progreso",
        body: "Verificá tu email para asegurar que tu cuenta y progreso estén protegidos.",
        sound: true,
        data: { type: "verification_reminder_scheduled" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: REMINDER_HOURS * 60 * 60, // Convert hours to seconds
      },
    });
    console.log(`✅ Verification reminder scheduled for ${REMINDER_HOURS} hours from now`);
  } catch (error) {
    console.error("❌ Error scheduling verification reminder:", error);
  }
}

/**
 * Cancel scheduled verification reminder (call when user verifies)
 */
export async function cancelVerificationReminder(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduled) {
      const type = notification.content.data?.type;
      if (type === "verification_reminder" || type === "verification_reminder_scheduled") {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    console.log("✅ Verification reminders cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling verification reminder:", error);
  }
}


// MILESTONE NOTIFICATION FUNCTION

const MILESTONE_PERCENTAGES = [10, 25, 50, 75, 100];

//GET MILESTONE MESSAGES BASED ON PERCENTAGE

function getMilestoneMessage(percentage: number, goalSpeedDays: number): { title: string, body: string } {
  const messages: Record<number, { title: string, body: string }[]> = {
    10: [
      { title: "🚀 ¡10% completado!", body: `Ya llevas el 10% de tu plan de ${goalSpeedDays} días. ¡Gran comienzo!` },
      { title: "💪 ¡Primer hito alcanzado!", body: "El 10% ya es tuyo. Cada paso cuenta." },
    ],
    25: [
      { title: "🔥 ¡25% del camino!", body: `Un cuarto de tu plan de ${goalSpeedDays} días completado. ¡Sigue así!` },
      { title: "⭐ ¡Cuarto del camino!", body: "25% logrado. Tu determinación es increíble." },
    ],
    50: [
      { title: "🎯 ¡Llegaste a la mitad!", body: `50% de tu plan de ${goalSpeedDays} días. ¡Eres imparable!` },
      { title: "💥 ¡Mitad del camino!", body: "50% completado. La meta está cada vez más cerca." },
    ],
    75: [
      { title: "🏆 ¡75% completado!", body: `Solo falta un cuarto para terminar tu plan de ${goalSpeedDays} días.` },
      { title: "⚡ ¡Ya casi llegas!", body: "75% logrado. La recta final está aquí." },
    ],
    100: [
      { title: "🎉 ¡LO LOGRASTE!", body: `Completaste tu plan de ${goalSpeedDays} días. ¡Eres un campeón!` },
      { title: "🏅 ¡META ALCANZADA!", body: `${goalSpeedDays} días completados. Tu nueva vida comienza ahora.` },
    ],
  };

  const options = messages[percentage] || messages[10];
  return options[Math.floor(Math.random() * options.length)];
}

async function getSentMilestone(): Promise<number[]> {
  try{ 
    const stored = await AsyncStorage.getItem(MILESTONE_NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

async function markMilestoneSent(percentage: number): Promise<void> {
  try{
    const sent = await getSentMilestone();
    if(!sent.includes(percentage)){
      sent.push(percentage)
      await AsyncStorage.setItem(MILESTONE_NOTIFICATION_KEY, JSON.stringify(sent));
    }
  } catch (error){
    console.log("⚠️ Error marking milestone sent:", error);
  }
}

/**
 * Check and send milestone notification if a new milestone is reached
 * Call this whenever progress is updated (e.g., in useProgressViewModel or on app open)
 * 
 * @param profileCreatedAt - The date the user's profile was created
 * @param goalSpeedDays - The user's goal speed in days (14, 21, 30, 60, or 90)
 */

export async function checkandSendMilestoneNotification(
  profileCreatedAt: string,
  goalSpeedDays: number
): Promise<void> {
  const Notif = await getNotifications();
  if(!Notif) return;

  // Check if notifications are enabled
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  // calculate percentage
  const now = new Date();
  const daysPassed = (now.getTime() - new Date(profileCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
  const currentPercentage = Math.min(100, (daysPassed / goalSpeedDays) * 100);

  // Get already sent milestones
  const sentMilestones = await getSentMilestone();

  //find highest mileston that should be sent
  for (const milestone of MILESTONE_PERCENTAGES) {
    if (currentPercentage >= milestone && !sentMilestones.includes(milestone)) {
      const message = getMilestoneMessage(milestone, goalSpeedDays);
      
      try{
        await Notif.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            sound: true,
            data: { type: "milestone", percentage: milestone, goalSpeedDays },
          },
          trigger: {
            type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
          },
        });
        
        await markMilestoneSent(milestone);
        console.log(`✅ Milestone notification sent: ${milestone}%`);
      } catch (error) {
        console.error(`❌ Error sending milestone notification:`, error);
      }
    }
  }
}

/**
 * Reset milestone notifications (e.g., if user restarts their plan)
 */
export async function resetMilestoneNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MILESTONE_NOTIFICATION_KEY);
    console.log("✅ Milestone notifications reset");
  } catch (error) {
    console.error("❌ Error resetting milestones:", error);
  }
}