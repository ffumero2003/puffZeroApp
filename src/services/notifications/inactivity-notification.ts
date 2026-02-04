// src/services/notifications/inactivity-notification.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { areNotificationsEnabled, getNotifications } from "./notification-service";

const LAST_ACTIVITY_KEY = "last_activity_timestamp";
const INACTIVITY_NOTIFICATIONS_SENT_KEY = "inactivity_notifications_sent";

const INACTIVITY_THRESHOLDS = [24, 48, 72]; // 1 day, 2 days, 3 days in hours

function getInactivityMessage(hoursInactive: number): { title: string; body: string } {
  if (hoursInactive >= 72) {
    const messages = [
      { title: "😟 Te extrañamos", body: "Han pasado 3 días sin verte. ¿Está todo bien? Tu progreso nos importa." },
      { title: "💭 ¿Sigues ahí?", body: "3 días sin registrar. No te rindas, cada día cuenta en tu camino." },
      { title: "🤗 No te olvides de ti", body: "Llevas 3 días ausente. Vuelve cuando estés listo, aquí estaremos." },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (hoursInactive >= 48) {
    const messages = [
      { title: "🤔 ¿Todo bien?", body: "Llevas 2 días sin conectar. Tu bienestar es importante para nosotros." },
      { title: "💪 No te rindas", body: "2 días sin verte. Recuerda por qué empezaste este camino." },
      { title: "🌟 Te esperamos", body: "Han pasado 2 días. Un pequeño paso hoy puede hacer la diferencia." },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  const messages = [
    { title: "👋 ¡Hola!", body: "Ha pasado un día sin verte. ¿Cómo va tu progreso?" },
    { title: "📱 Te echamos de menos", body: "Un día sin conectar. Registra tu progreso para mantener el ritmo." },
    { title: "🎯 Mantén el enfoque", body: "Llevas 24 horas sin registrar. ¡No pierdas tu racha!" },
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Update last activity timestamp - call when user opens app or registers a puff
 */
export async function updateLastActivity(): Promise<void> {
  try {
    const now = new Date().toISOString();
    await AsyncStorage.setItem(LAST_ACTIVITY_KEY, now);
    await AsyncStorage.setItem(INACTIVITY_NOTIFICATIONS_SENT_KEY, JSON.stringify([]));
    // Reschedule inactivity notifications from now
    await scheduleInactivityNotifications();
    // console.log("✅ Last activity updated:", now);
  } catch (error) {
    console.error("❌ Error updating last activity:", error);
  }
}

/**
 * Schedule inactivity notifications for 24h, 48h, and 72h from now
 */
export async function scheduleInactivityNotifications(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  await cancelInactivityNotifications();

  try {
    for (const hours of INACTIVITY_THRESHOLDS) {
      const message = getInactivityMessage(hours);
      const seconds = hours * 60 * 60;

      await Notif.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
          data: { type: "inactivity_reminder", hoursInactive: hours },
        },
        trigger: {
          type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
        },
      });

      // console.log(`✅ Inactivity notification scheduled for ${hours} hours`);
    }
  } catch (error) {
    console.error("❌ Error scheduling inactivity notifications:", error);
  }
}

/**
 * Cancel all scheduled inactivity notifications
 */
export async function cancelInactivityNotifications(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === "inactivity_reminder") {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    // console.log("✅ Inactivity notifications cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling inactivity notifications:", error);
  }
}

/**
 * Send immediate inactivity notification (for testing)
 */
export async function sendInactivityNotification(hours: number = 24): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const message = getInactivityMessage(hours);
    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "inactivity_reminder", hoursInactive: hours },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    // console.log(`✅ Inactivity notification sent (test): ${hours} hours`);
  } catch (error) {
    console.error("❌ Error sending inactivity notification:", error);
  }
}
