// src/services/notifications/daily-quote-notification.ts
import { supabase } from "@/src/lib/supabase"; // To fetch quote from generate-quote edge function
import { getNotifications } from "./notification-service";

// ============================================
// CURRENT: Sends notification immediately (for testing)
// ============================================
export async function sendDailyQuoteNotification(quote: string): Promise<void> {
  // ... existing code stays the same
}

// ============================================
// NEW: Schedule daily quote notification for 8 AM every day
// Uses Expo's CALENDAR trigger type for recurring daily notifications
// ============================================
export async function scheduleDailyQuoteNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel any existing daily quote notifications first
  // This prevents duplicate notifications if called multiple times
  await cancelDailyQuoteNotification();

  try {
    // Fetch today's quote from your generate-quote edge function
    // This calls Supabase, which either returns cached quote or generates new one via OpenAI
    const { data, error } = await supabase.functions.invoke("generate-quote");
    
    // Fallback quote if the edge function fails
    const quote = data?.quote || "Cada día es una nueva oportunidad para ser mejor.";

    // Schedule notification for 8:00 AM daily
    // CALENDAR trigger fires at a specific time each day
    await Notif.scheduleNotificationAsync({
      content: {
        title: "💨 Tu frase del día",
        body: quote,
        sound: true,
        data: { type: "daily_quote" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.CALENDAR,
        hour: 8,      // 8 AM
        minute: 0,    // :00
        repeats: true, // Fire every day at this time
      },
    });

    // console.log("✅ Daily quote notification scheduled for 8 AM");
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
