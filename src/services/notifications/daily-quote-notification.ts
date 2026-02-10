// src/services/notifications/daily-quote-notification.ts
import { fetchAIQuote, getCachedQuote } from "@/src/services/ai-quotes-service";
import { areNotificationsEnabled, getNotifications } from "./notification-service";

// ============================================
// Sends notification immediately (for testing)
// ============================================
export async function sendDailyQuoteNotification(quote: string): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Send immediately (2-second delay) — used for testing only
  await Notif.scheduleNotificationAsync({
    content: {
      title: "💨 Tu frase del día",
      body: quote,
      sound: true,
      data: { type: "daily_quote" },
    },
    trigger: {
      type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

export async function scheduleDailyQuoteNotification(): Promise<void> {
  // Check if user has daily reminders enabled
  const enabled = await areNotificationsEnabled();
  if (!enabled) {
    console.log("⏭️ Daily reminder skipped - notifications disabled");
    return;
  }

  const Notif = await getNotifications();
  if (!Notif) return;

  await cancelDailyQuoteNotification();

  try {
    // Use the shared quote source — first try the local cache (same quote
    // shown on the home screen), and if empty, fetch a fresh one.
    // This guarantees the notification and home screen show the SAME message.
    let quote = await getCachedQuote();
    if (!quote) {
      // No cached quote yet (first open) — fetch one, which also caches it
      quote = await fetchAIQuote();
    }

    // Schedule for tomorrow 8:30 AM (one-shot, not repeating).
    // Each app open reschedules, so the user always gets the current quote.
    const tomorrow8AM = new Date();
    tomorrow8AM.setDate(tomorrow8AM.getDate() + 1);
    tomorrow8AM.setHours(8, 30, 0, 0);

    await Notif.scheduleNotificationAsync({
      content: {
        title: "💨 Tu frase del día",
        body: quote,
        sound: true,
        data: { type: "daily_quote" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.DATE,
        date: tomorrow8AM,
      },
    });
  } catch (error) {
    console.error("❌ Error scheduling daily quote notification:", error);
  }
}


// ============================================
// Cancel scheduled daily quote notifications
// Call this before rescheduling to avoid duplicates
// ============================================
export async function cancelDailyQuoteNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    // Get all scheduled notifications
    const scheduled = await Notif.getAllScheduledNotificationsAsync();
    
    // Find and cancel only the daily_quote ones
    for (const notification of scheduled) {
      if (notification.content.data?.type === "daily_quote") {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
  } catch (error) {
    console.log("⚠️ Error canceling daily quote notification:", error);
  }
}