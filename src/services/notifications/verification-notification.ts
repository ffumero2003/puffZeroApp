// src/services/notifications/verification-notification.ts
// Unified notifications for both account verification and email change verification

import { VerificationType } from "../verification/verification-service";
import { getNotifications } from "./notification-service";

const VERIFICATION_REMINDER_TYPE = "verification_reminder";

// ============================================
// Schedule reminders (day 3 and day 5)
// ============================================

/**
 * Schedule verification reminders at day 3 and day 5
 * Works for both account verification and email change
 */
export async function scheduleVerificationReminders(type: VerificationType): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel existing reminders first
  await cancelVerificationReminders();

  const DAY_3_SECONDS = 3 * 24 * 60 * 60;
  const DAY_5_SECONDS = 5 * 24 * 60 * 60;

  const isEmailChange = type === "email_change";

  try {
    // Day 3 reminder
    await Notif.scheduleNotificationAsync({
      content: {
        title: isEmailChange ? "📧 Verificá tu nuevo email" : "📧 Verificá tu cuenta",
        body: isEmailChange 
          ? "Tenés un cambio de email pendiente. Revisá tu bandeja de entrada."
          : "Verificá tu email para proteger tu progreso.",
        sound: true,
        data: { type: VERIFICATION_REMINDER_TYPE, verificationType: type, day: 3 },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: DAY_3_SECONDS,
      },
    });

    // Day 5 reminder
    await Notif.scheduleNotificationAsync({
      content: {
        title: isEmailChange ? "⚠️ Tu cambio de email expira pronto" : "⚠️ Verificá tu cuenta",
        body: isEmailChange
          ? "Verificá tu nuevo email antes de que expire en 2 días."
          : "Tu cuenta será bloqueada si no verificás en 2 días.",
        sound: true,
        data: { type: VERIFICATION_REMINDER_TYPE, verificationType: type, day: 5 },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: DAY_5_SECONDS,
      },
    });

    console.log(`✅ ${type} verification reminders scheduled for day 3 and day 5`);
  } catch (error) {
    console.error("❌ Error scheduling verification reminders:", error);
  }
}

// ============================================
// Cancel reminders
// ============================================

/**
 * Cancel all verification reminders
 */
export async function cancelVerificationReminders(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();

    for (const notification of scheduled) {
      if (notification.content.data?.type === VERIFICATION_REMINDER_TYPE) {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    console.log("✅ Verification reminders cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling verification reminders:", error);
  }
}

// ============================================
// Expiration notification
// ============================================

/**
 * Send notification when verification expires (email change only)
 */
export async function sendVerificationExpiredNotification(type: VerificationType): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Only send for email change (account verification blocks the app instead)
  if (type !== "email_change") return;

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "📧 Cambio de email cancelado",
        body: "Tu solicitud de cambio de email expiró. Podés intentarlo de nuevo en Configuración.",
        sound: true,
        data: { type: "verification_expired" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  } catch (error) {
    console.error("❌ Error sending verification expired notification:", error);
  }
}

// ============================================
// Backwards compatibility aliases
// ============================================

export async function scheduleEmailChangeReminders(): Promise<void> {
  return scheduleVerificationReminders("email_change");
}

export async function cancelEmailChangeReminders(): Promise<void> {
  return cancelVerificationReminders();
}

export async function sendEmailChangeExpiredNotification(): Promise<void> {
  return sendVerificationExpiredNotification("email_change");
}
