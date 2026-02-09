// src/services/notifications/daily-reminder-notification.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { areNotificationsEnabled, getNotifications } from "./notification-service";

const LAST_REMINDER_SCHEDULE_KEY = "daily_reminder_last_scheduled";

// ============================================
// Message variations for daily reminder
// A random one is picked each time the notification fires
// ============================================
const DAILY_REMINDER_MESSAGES = [
  {
    title: "🌅 Nuevo día",
    body: "Si hoy fumas, regístralo. Si no, vas excelente."
  },
  {
    title: "☀️ Buenos días",
    body: "Si hoy vapeas, regístralo. Si no, vas perfecto."
  },
  {
    title: "🎯 Regla del día",
    body: "Fumarás → regístralo. No fumarás → vas muy bien."
  },
  {
    title: "🧠 Empieza consciente",
    body: "Si hoy fumas, regístralo. Si no, gran comienzo."
  },
  {
    title: "🏆 Inicio ganador",
    body: "Si hoy fumas, regístralo. Si no, sigue así."
  },
  {
    title: "📅 Día nuevo",
    body: "Vapearás → regístralo. No vapearás → excelente."
  },
  {
    title: "💪 Mentalidad del día",
    body: "Si hoy fumas, regístralo. Si no, vas por buen camino."
  },
  {
    title: "⏰ 8:00 AM",
    body: "Hoy empieza el control: fumas → registras, no fumas → ganas."
  },
];



/**
 * Get a random daily reminder message
 * Called each time we schedule the notification
 */
function getRandomReminderMessage(): { title: string; body: string } {
  return DAILY_REMINDER_MESSAGES[Math.floor(Math.random() * DAILY_REMINDER_MESSAGES.length)];
}

// It only reschedules if 24+ hours have passed since the last schedule
export async function refreshDailyReminderIfNeeded(): Promise<void> {
  try {
    const lastScheduled = await AsyncStorage.getItem(LAST_REMINDER_SCHEDULE_KEY);

    if (lastScheduled) {
      const hoursSince = (Date.now() - parseInt(lastScheduled, 10)) / (1000 * 60 * 60);
      // Only reschedule if 24+ hours have passed
      if (hoursSince < 23.5) return;
    }

    await scheduleDailyLocalReminder();
    await AsyncStorage.setItem(LAST_REMINDER_SCHEDULE_KEY, Date.now().toString());
  } catch (error) {
    console.error("❌ Error in refreshDailyReminderIfNeeded:", error);
  }
}

/**
 * Schedule a local daily reminder at 8 AM
 * Picks a random message from the variations
 */
export async function scheduleDailyLocalReminder(): Promise<void> {
  // Check if user has daily reminders enabled
  const enabled = await areNotificationsEnabled();
  if (!enabled) {
    console.log("⏭️ Daily reminder skipped - notifications disabled");
    return;
  }

  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel any existing daily reminders first to avoid duplicates
  await cancelDailyLocalReminder();

  try {
    const message = getRandomReminderMessage();
    
    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "daily_reminder" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.DAILY,
        hour: 8,   // 8 AM
        minute: 0,
      },
    });
    // console.log("✅ Daily local reminder scheduled for 8 AM");
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