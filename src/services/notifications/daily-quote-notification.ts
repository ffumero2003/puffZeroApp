// src/services/notifications/daily-quote-notification.ts
import { supabase } from "@/src/lib/supabase"; // To fetch quote from generate-quote edge function
import { getNotifications } from "./notification-service";

// ============================================
// CURRENT: Sends notification immediately (for testing)
// ============================================
export async function sendDailyQuoteNotification(quote: string): Promise<void> {
  // ... existing code stays the same
}

export async function scheduleDailyQuoteNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  await cancelDailyQuoteNotification();

  try {
    // Fetch the global daily quote from the edge function
    const { data, error } = await supabase.functions.invoke("generate-quote");

    const quote = data?.quote || "Cada día es una nueva oportunidad para ser mejor.";

    // Schedule for tomorrow 8 AM (one-shot, not repeating).
    // Each app open reschedules with a new quote from the edge function,
    // so the user always gets a fresh quote in their notification.
    const tomorrow8AM = new Date();
    tomorrow8AM.setDate(tomorrow8AM.getDate() + 1);
    tomorrow8AM.setHours(8, 0, 0, 0);

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
// NEW: Cancel scheduled daily quote notifications
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
    // console.log("✅ Daily quote notification cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling daily quote notification:", error);
  }
}
