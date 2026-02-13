// src/services/notifications/goal-completed-notification.ts
// Schedules a notification for the exact moment the countdown timer reaches zero.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { areNotificationsEnabled, getNotifications } from "./notification-service";

const GOAL_NOTIFICATION_ID_KEY = "goal_completed_notification_id";

// Random congratulatory messages
const GOAL_MESSAGES = [
  { title: "⏰ ¡Tu plan terminó!", body: "Tu cuenta regresiva llegó a cero. Abrí la app y mirá tu progreso." },
  { title: "🏁 ¡Se cumplió el plazo!", body: "Tu plan llegó a su fin. Entrá a ver cómo te fue." },
  { title: "📊 ¡Tiempo cumplido!", body: "Tu plan terminó hoy. Revisá tu progreso en la app." },
  { title: "🔔 ¡Tu meta llegó a su fecha!", body: "El tiempo de tu plan se completó. ¿Cómo te fue? Mirá tus resultados." },
];

/**
 * Schedule a notification for the exact moment the countdown timer ends.
 * Safe to call multiple times — cancels the previous one before rescheduling.
 */
export async function scheduleGoalCompletedNotification(
  profileCreatedAt: Date,
  goalSpeedDays: number
): Promise<void> {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const Notif = await getNotifications();
  if (!Notif) return;

  // Calculate the exact end time
  const endTime = profileCreatedAt.getTime() + goalSpeedDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const secondsUntilEnd = Math.floor((endTime - now) / 1000);

  // If the timer already ended, don't schedule
  if (secondsUntilEnd <= 0) return;

  // Cancel any previously scheduled goal notification to avoid duplicates
  await cancelGoalCompletedNotification();

  // Pick a random congratulatory message
  const message = GOAL_MESSAGES[Math.floor(Math.random() * GOAL_MESSAGES.length)];

  try {
    const notificationId = await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "goal_completed" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilEnd,
      },
    });

    // Save the notification ID so we can cancel it later if needed
    await AsyncStorage.setItem(GOAL_NOTIFICATION_ID_KEY, notificationId);
  } catch (error) {
    console.error("❌ Error scheduling goal completed notification:", error);
  }
}

/**
 * Cancel a previously scheduled goal completion notification.
 * Call this if the user resets their plan or logs out.
 */
export async function cancelGoalCompletedNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const storedId = await AsyncStorage.getItem(GOAL_NOTIFICATION_ID_KEY);
    if (storedId) {
      await Notif.cancelScheduledNotificationAsync(storedId);
      await AsyncStorage.removeItem(GOAL_NOTIFICATION_ID_KEY);
    }
  } catch (error) {
    console.error("❌ Error canceling goal completed notification:", error);
  }
}
