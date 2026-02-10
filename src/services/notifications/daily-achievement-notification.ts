// src/services/notifications/daily-achievement-notification.ts
import { supabase } from "@/src/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotifications } from "./notification-service";


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
 * Schedule daily achievement notification at 11:59 PM with real puff data.
 * Call this every time puffs change so the notification always has the latest data.
 */
export async function scheduleDailyAchievementCheck(
  todayPuffs: number,
  dailyGoal: number
): Promise<void> {
  const { areNotificationsEnabled } = await import("./notification-service");
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const Notif = await getNotifications();
  if (!Notif) return;

  // Cancel previous scheduled one so we replace it with updated data
  await cancelDailyAchievementCheck();

  try {
    // Only schedule if user is within their goal
    if (todayPuffs > dailyGoal) return;

    const message = getAchievementMessage(todayPuffs, dailyGoal);

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "daily_achievement_check", todayPuffs, dailyGoal },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.DAILY,
        hour: 23, // 11:59 PM
        minute: 59,
      },
    });
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
 * Check yesterday's puffs on app open and send achievement notification if applicable.
 * Only sends once per day, and only if the user was under their daily goal.
 */
const ACHIEVEMENT_LAST_SENT_KEY = "daily_achievement_last_sent_date";

export async function checkAndSendDailyAchievementOnOpen(userId: string): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    // Check if we already sent today
    const lastSentDate = await AsyncStorage.getItem(ACHIEVEMENT_LAST_SENT_KEY);
    const today = new Date().toDateString();
    if (lastSentDate === today) {
      return; // Already sent today, skip
    }

    // Read yesterday's stored puff data (user-scoped keys)
    const storedDate = await AsyncStorage.getItem(`todayDate_${userId}`);
    const storedPuffs = await AsyncStorage.getItem(`todayPuffs_${userId}`);

    if (!storedDate) return;

    // Only send if it's a new day (storedDate is yesterday)
    if (storedDate === today) return; // Data is from today, not yesterday yet

    const yesterdayPuffs = parseInt(storedPuffs || "0", 10);

    // Fetch daily goal from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("puffs_per_day")
      .eq("user_id", user.id)
      .single();

    const dailyGoal = profile?.puffs_per_day;
    if (!dailyGoal) return;

    // Only send if user was under or equal to their daily goal
    if (yesterdayPuffs > dailyGoal) return;

    // Send the real achievement notification with actual data
    await sendDailyAchievementNotification(yesterdayPuffs, dailyGoal);

    // Mark as sent today so we don't send again
    await AsyncStorage.setItem(ACHIEVEMENT_LAST_SENT_KEY, today);
  } catch (error) {
    console.error("❌ Error checking daily achievement on open:", error);
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

    // console.log("✅ Daily achievement check cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling daily achievement check:", error);
  }
}
