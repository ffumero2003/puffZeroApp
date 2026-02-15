// src/services/notifications/weekly-summary-notification.ts
import { CURRENCY_SYMBOLS } from "@/src/constants/currency";
import { supabase } from "@/src/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotifications } from "./notification-service";

const PROFILE_CREATED_KEY = "profile_created_at";

/**
 * Format currency amount
 */
function formatAmount(amount: number, currencyCode: string): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || "$";
  const formatted = Math.round(amount).toLocaleString("es-ES");
  return `${symbol}${formatted}`;
}

/**
 * Get weekly summary message
 */
function getWeeklySummaryMessage(
  avgPuffsPerDay: number,
  moneySaved: number,
  currencyCode: string
): { title: string; body: string } {
  const formattedMoney = formatAmount(moneySaved, currencyCode);
  const roundedAvg = Math.round(avgPuffsPerDay);

  const messages = [
    {
      title: "📊 Resumen semanal",
      body: `Esta semana promediaste ${roundedAvg} puffs/día. Has ahorrado ${formattedMoney} en total. ¡Sigue así!`,
    },
    {
      title: "📈 Tu semana en números",
      body: `Promedio: ${roundedAvg} puffs diarios. Ahorro total: ${formattedMoney}. ¡Cada día cuenta!`,
    },
    {
      title: "🗓️ Resumen de la semana",
      body: `${roundedAvg} puffs/día en promedio y ${formattedMoney} ahorrados. ¡Excelente progreso!`,
    },
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Calculate average puffs per day for the last 7 days
 */
async function getAveragePuffsLast7Days(userId: string): Promise<number> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from("puffs")
      .select("count")
      .eq("user_id", userId)
      .gte("timestamp", sevenDaysAgo.toISOString());

    if (error || !data) return 0;

    const totalPuffs = data.reduce((sum, p) => sum + (p.count || 1), 0);
    return totalPuffs / 7;
  } catch (error) {
    console.error("❌ Error calculating average puffs:", error);
    return 0;
  }
}

/**
 * Calculate total money saved since profile creation
 */
async function getTotalMoneySaved(
  userId: string,
  moneyPerMonth: number
): Promise<number> {
  try {
    // Get profile created date
    const storedDate = await AsyncStorage.getItem(PROFILE_CREATED_KEY);
    let profileCreatedAt: Date;

    if (storedDate) {
      profileCreatedAt = new Date(storedDate);
    } else {
      // Fallback: fetch from Supabase
      const { data } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("user_id", userId)
        .single();

      profileCreatedAt = data?.created_at ? new Date(data.created_at) : new Date();
    }

    const daysSinceStart = Math.max(
      0,
      (Date.now() - profileCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (moneyPerMonth / 30) * daysSinceStart;
  } catch (error) {
    console.error("❌ Error calculating money saved:", error);
    return 0;
  }
}

/**
 * Schedule weekly summary notification for Sundays at 6 PM with real data.
 * Call this on app open so the notification always has the latest stats.
 */
export async function scheduleWeeklySummaryNotification(): Promise<void> {
  const { areNotificationsEnabled } = await import("./notification-service");
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const Notif = await getNotifications();
  if (!Notif) return;

  await cancelWeeklySummaryNotification();

  try {
    // Get user data to build real summary
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("money_per_month, currency")
      .eq("user_id", user.id)
      .single();

    const moneyPerMonth = profile?.money_per_month || 0;
    const currencyCode = profile?.currency || "CRC";

    // Calculate real stats
    const avgPuffs = await getAveragePuffsLast7Days(user.id);
    const moneySaved = await getTotalMoneySaved(user.id, moneyPerMonth);

    const message = getWeeklySummaryMessage(avgPuffs, moneySaved, currencyCode);

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: {
          type: "weekly_summary_trigger",
          avgPuffsPerDay: avgPuffs,
          totalMoneySaved: moneySaved,
          currencyCode,
        },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1, // Sunday
        hour: 18, // 6 PM
        minute: 0,
      },
    });
  } catch (error) {
    console.error("❌ Error scheduling weekly summary:", error);
  }
}


/**
 * Cancel weekly summary notification
 */
export async function cancelWeeklySummaryNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const scheduled = await Notif.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (
        notification.content.data?.type === "weekly_summary_trigger" ||
        notification.content.data?.type === "weekly_summary"
      ) {
        await Notif.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    // console.log("✅ Weekly summary notification cancelled");
  } catch (error) {
    console.log("⚠️ Error canceling weekly summary:", error);
  }
}

/**
 * Send weekly summary notification immediately (for testing or triggered by schedule)
 */
export async function sendWeeklySummaryNotification(
  userId: string,
  moneyPerMonth: number,
  currencyCode: string
): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const avgPuffs = await getAveragePuffsLast7Days(userId);
    const moneySaved = await getTotalMoneySaved(userId, moneyPerMonth);

    const message = getWeeklySummaryMessage(avgPuffs, moneySaved, currencyCode);

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: {
          type: "weekly_summary",
          avgPuffsPerDay: avgPuffs,
          totalMoneySaved: moneySaved,
          currencyCode,
        },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    // console.log("✅ Weekly summary notification sent!");
  } catch (error) {
    console.error("❌ Error sending weekly summary:", error);
  }
}
