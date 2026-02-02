// src/services/notifications/verification-notification.ts
import { getNotifications } from "./notification-service";

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

  const REMINDER_HOURS = 72; // 1.5 days = 36 hours

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
