// src/services/notifications/daily-reminder-notification.ts
import { getNotifications } from "./notification-service";

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