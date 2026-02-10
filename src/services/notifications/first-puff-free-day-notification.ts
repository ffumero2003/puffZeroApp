// src/services/notifications/first-puff-free-day-notification.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotifications } from "./notification-service";

const FIRST_PUFF_FREE_DAY_SENT_KEY = "first_puff_free_day_notification_sent";
// Use a function to generate user-scoped keys, matching useHomeViewModel.ts
const getTodayPuffsKey = (userId: string) => `todayPuffs_${userId}`;
const getTodayDateKey = (userId: string) => `todayDate_${userId}`;

/**
 * Get congratulatory message for first puff-free day
 */
function getFirstPuffFreeDayMessage(): { title: string; body: string } {
  const messages = [
    {
      title: "🎉 ¡Felicidades!",
      body: "¡Tu primer día completamente libre de puffs! Este es un logro increíble. ¡Estamos muy orgullosos de ti!",
    },
    {
      title: "🏆 ¡Lo lograste!",
      body: "¡Un día entero sin vapear! Este es el comienzo de algo grande. ¡Sigue adelante!",
    },
    {
      title: "⭐ ¡Día histórico!",
      body: "¡Tu primer día 100% libre! Demostraste que puedes hacerlo. ¡Celebra este momento!",
    },
    {
      title: "🌟 ¡Increíble logro!",
      body: "¡Completaste un día entero sin puffs! Eres más fuerte de lo que crees. ¡Felicidades!",
    },
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Check if first puff-free day notification was already sent
 */
async function wasFirstPuffFreeDaySent(): Promise<boolean> {
  try {
    const sent = await AsyncStorage.getItem(FIRST_PUFF_FREE_DAY_SENT_KEY);
    return sent === "true";
  } catch (error) {
    return false;
  }
}

/**
 * Mark first puff-free day notification as sent
 */
async function markFirstPuffFreeDaySent(): Promise<void> {
  try {
    await AsyncStorage.setItem(FIRST_PUFF_FREE_DAY_SENT_KEY, "true");
  } catch (error) {
    console.error("❌ Error marking first puff-free day sent:", error);
  }
}

/**
 * Check if yesterday was a puff-free day and send notification
 * Call this when the app opens or at the start of a new day
 */
export async function checkAndSendFirstPuffFreeDayNotification(userId: string): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;



  try {
    // Check if already sent
    const alreadySent = await wasFirstPuffFreeDaySent();
    if (alreadySent) {
      // console.log("📊 First puff-free day notification already sent");
      return;
    }

    // Get stored date and puffs
    const [storedDate, storedPuffs] = await Promise.all([
      AsyncStorage.getItem(getTodayDateKey(userId)),
      AsyncStorage.getItem(getTodayPuffsKey(userId)),
    ]);

    if (!storedDate) {
      console.log("📊 No previous day data found");
      return;
    }

    const today = new Date().toDateString();
    
    // If it's a new day and yesterday had 0 puffs
    if (storedDate !== today) {
      const yesterdayPuffs = parseInt(storedPuffs || "0", 10);
      
      if (yesterdayPuffs === 0) {
        // Yesterday was puff-free!
        const message = getFirstPuffFreeDayMessage();

        await Notif.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            sound: true,
            data: { type: "first_puff_free_day" },
          },
          trigger: {
            type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
          },
        });

        await markFirstPuffFreeDaySent();
        // console.log("✅ First puff-free day notification sent!");
      }
    }
  } catch (error) {
    console.error("❌ Error checking first puff-free day:", error);
  }
}

/**
 * Schedule end-of-day check for puff-free day
 * NOTE: Removed scheduled notification since it can't evaluate puff data at trigger time.
 * The actual check happens via checkAndSendFirstPuffFreeDayNotification() on app open.
 */
export async function scheduleEndOfDayPuffFreeCheck(): Promise<void> {
  // No-op: the puff-free day check is handled on app open
  // via checkAndSendFirstPuffFreeDayNotification()
  return;
}


/**
 * Cancel end-of-day puff-free check
 */
export async function cancelEndOfDayPuffFreeCheck(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === "puff_free_day_check") {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.log("⚠️ Error canceling puff-free check:", error);
  }
}

/**
 * Check current day and send notification if puff-free (call at end of day)
 */
export async function checkCurrentDayAndNotify(userId: string): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

 

  try {
    const alreadySent = await wasFirstPuffFreeDaySent();
    if (alreadySent) return;

    const todayPuffs = await AsyncStorage.getItem(getTodayPuffsKey(userId));
    const puffCount = parseInt(todayPuffs || "0", 10);

    if (puffCount === 0) {
      const message = getFirstPuffFreeDayMessage();

      await Notif.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
          data: { type: "first_puff_free_day" },
        },
        trigger: {
          type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });

      await markFirstPuffFreeDaySent();
      // console.log("✅ First puff-free day notification sent!");
    }
  } catch (error) {
    console.error("❌ Error checking current day:", error);
  }
}

/**
 * Send first puff-free day notification immediately (for testing)
 */
export async function sendFirstPuffFreeDayNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const message = getFirstPuffFreeDayMessage();

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "first_puff_free_day" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    // console.log("✅ First puff-free day notification sent (test)!");
  } catch (error) {
    console.error("❌ Error sending first puff-free day notification:", error);
  }
}

/**
 * Reset first puff-free day tracking (for testing)
 */
export async function resetFirstPuffFreeDayTracking(): Promise<void> {
  await AsyncStorage.removeItem(FIRST_PUFF_FREE_DAY_SENT_KEY);
  // console.log("✅ First puff-free day tracking reset");
}
