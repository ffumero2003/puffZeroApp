// src/services/notifications/daily-achievement-notification.ts
import { getNotifications } from "./notification-service";

const TODAY_PUFFS_KEY = "todayPuffs";

/**
 * Get random achievement message based on performance
 */
function getAchievementMessage(todayPuffs: number, dailyGoal: number): { title: string; body: string } {
  const percentage = Math.round((todayPuffs / dailyGoal) * 100);

  // Under 50% of daily goal - exceptional!
  if (percentage <= 50) {
    const messages = [
      { title: "🏆 ¡Increíble!", body: `Solo ${todayPuffs} puffs hoy, menos de la mitad de tu límite. ¡Eres imparable!` },
      { title: "⭐ ¡Día excepcional!", body: `${todayPuffs}/${dailyGoal} puffs. Tu disciplina es admirable.` },
      { title: "🔥 ¡Récord del día!", body: `Usaste menos del 50% de tu límite. ¡Sigue así!` },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Under 75% - great job
  if (percentage <= 75) {
    const messages = [
      { title: "💪 ¡Buen trabajo!", body: `${todayPuffs}/${dailyGoal} puffs hoy. Estás por debajo de tu límite.` },
      { title: "✨ ¡Día exitoso!", body: `Te mantuviste bien dentro de tu objetivo. ¡Felicidades!` },
      { title: "🎯 ¡Meta cumplida!", body: `${todayPuffs} puffs, muy por debajo de ${dailyGoal}. ¡Excelente control!` },
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Under 100% - made it
  const messages = [
    { title: "✅ ¡Lo lograste!", body: `${todayPuffs}/${dailyGoal} puffs. Te mantuviste dentro del límite.` },
    { title: "👏 ¡Bien hecho!", body: `Cerraste el día por debajo de tu meta. ¡Cada día cuenta!` },
    { title: "🙌 ¡Objetivo cumplido!", body: `${todayPuffs} puffs hoy. Mañana puedes hacerlo aún mejor.` },
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Schedule daily achievement check at 8 PM
 */
export async function scheduleDailyAchievementCheck(dailyGoal: number): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel any existing achievement notifications first
  await cancelDailyAchievementCheck();

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: "🎯 Revisión diaria",
        body: "Verificando tu progreso del día...",
        sound: true,
        data: { type: "daily_achievement_check", dailyGoal },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.DAILY,
        hour: 20, // 8 PM
        minute: 0,
      },
    });

    console.log("✅ Daily achievement check scheduled for 8 PM");
  } catch (error) {
    console.error("❌ Error scheduling daily achievement check:", error);
  }
}

/**
 * Send immediate achievement notification (for testing)
 */
export async function sendDailyAchievementNotification(
  todayPuffs: number,
  dailyGoal: number
): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  // Only send if under or equal to daily goal
  if (todayPuffs > dailyGoal) {
    console.log("📊 Puffs exceeded daily goal, no achievement notification sent");
    return;
  }

  try {
    const message = getAchievementMessage(todayPuffs, dailyGoal);

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "daily_achievement", todayPuffs, dailyGoal },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    console.log("✅ Daily achievement notification sent!");
  } catch (error) {
    console.error("❌ Error sending daily achievement notification:", error);
  }
}

/**
 * Cancel scheduled daily achievement check
 */
export async function cancelDailyAchievementCheck(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();

    for (const notification of scheduled) {
      if (
        notification.content.data?.type === "daily_achievement_check" ||
        notification.content.data?.type === "daily_achievement"
      ) {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log("✅ Daily achievement check cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling daily achievement check:", error);
  }
}
