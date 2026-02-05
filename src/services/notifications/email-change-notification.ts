// src/services/notifications/email-change-notification.ts
// Notifications for pending email change reminders

import { getNotifications } from "./notification-service";

const EMAIL_CHANGE_REMINDER_TYPE = "email_change_reminder";

/**
 * Schedule email change verification reminders at day 3 and day 5
 */
export async function scheduleEmailChangeReminders(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel existing reminders first
  await cancelEmailChangeReminders();

  const DAY_3_SECONDS = 3 * 24 * 60 * 60; // 3 days
  const DAY_5_SECONDS = 5 * 24 * 60 * 60; // 5 days

  try {
    // Day 3 reminder
    await Notif.scheduleNotificationAsync({
      content: {
        title: "📧 Verificá tu nuevo email",
        body: "Tenés un cambio de email pendiente. Revisá tu bandeja de entrada.",
        sound: true,
        data: { type: EMAIL_CHANGE_REMINDER_TYPE, day: 3 },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: DAY_3_SECONDS,
      },
    });

    // Day 5 reminder
    await Notif.scheduleNotificationAsync({
      content: {
        title: "⚠️ Tu cambio de email expira pronto",
        body: "Verificá tu nuevo email antes de que expire en 2 días.",
        sound: true,
        data: { type: EMAIL_CHANGE_REMINDER_TYPE, day: 5 },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: DAY_5_SECONDS,
      },
    });

    console.log("✅ Email change reminders scheduled for day 3 and day 5");
  } catch (error) {
    console.error("❌ Error scheduling email change reminders:", error);
  }
}

/**
 * Cancel all email change reminders
 */
export async function cancelEmailChangeReminders(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();

    for (const notification of scheduled) {
      if (notification.content.data?.type === EMAIL_CHANGE_REMINDER_TYPE) {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    console.log("✅ Email change reminders cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling email change reminders:", error);
  }
}

/**
 * Send immediate notification when email change expires
 */
export async function sendEmailChangeExpiredNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "📧 Cambio de email cancelado",
        body: "Tu solicitud de cambio de email expiró. Podés intentarlo de nuevo en Configuración.",
        sound: true,
        data: { type: "email_change_expired" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  } catch (error) {
    console.error("❌ Error sending email change expired notification:", error);
  }
}
