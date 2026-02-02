// src/services/notifications/daily-quote-notification.ts
import { getNotifications } from "./notification-service";

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
