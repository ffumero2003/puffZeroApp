// src/services/notifications/money-saved-milestone-notification.ts
import { CRC_EXCHANGE_RATES, CURRENCY_SYMBOLS } from "@/src/constants/currency";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getNotifications } from "./notification-service";

const MONEY_MILESTONE_KEY = "money_milestone_achieved";

// Base milestones in USD
const USD_MILESTONES = [25, 50, 100, 250, 500, 1000];

/**
 * Convert USD milestone to user's currency
 */
function convertToUserCurrency(usdAmount: number, currencyCode: string): number {
  // CRC_EXCHANGE_RATES shows how much of each currency equals 1 CRC
  // We need to convert USD -> CRC -> target currency
  
  // 1 USD ≈ 500 CRC (based on USD_SV rate of 0.002)
  const usdToCrc = 1 / (CRC_EXCHANGE_RATES.USD_SV || 0.002);
  const crcAmount = usdAmount * usdToCrc;
  
  // Now convert CRC to target currency
  const targetRate = CRC_EXCHANGE_RATES[currencyCode] || 1;
  return Math.round(crcAmount * targetRate);
}

/**
 * Get milestones in user's currency
 */
export function getMilestonesForCurrency(currencyCode: string): number[] {
  // For USD currencies, use base milestones
  if (currencyCode === "USD_SV" || currencyCode === "USD_PA") {
    return USD_MILESTONES;
  }
  
  return USD_MILESTONES.map(usd => convertToUserCurrency(usd, currencyCode));
}

/**
 * Format currency amount for display
 */
function formatAmount(amount: number, currencyCode: string): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || "$";
  
  // For large numbers, format with thousands separator
  const formatted = amount.toLocaleString("es-ES");
  
  return `${symbol}${formatted}`;
}

/**
 * Get achievement message based on milestone
 */
function getMilestoneMessage(amount: number, currencyCode: string): { title: string; body: string } {
  const formattedAmount = formatAmount(amount, currencyCode);
  
  const messages = [
    { title: "💰 ¡Felicidades!", body: `Has ahorrado ${formattedAmount}. ¡Tu billetera te lo agradece!` },
    { title: "🎉 ¡Logro desbloqueado!", body: `${formattedAmount} ahorrados. ¡Sigue así!` },
    { title: "💵 ¡Increíble ahorro!", body: `Ya llevas ${formattedAmount} ahorrados. ¡Eso es dinero real!` },
    { title: "🏆 ¡Meta alcanzada!", body: `${formattedAmount} que no se fueron en humo. ¡Felicidades!` },
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get the highest milestone achieved that hasn't been notified yet
 */
async function getNextMilestoneToNotify(
  currentSaved: number,
  currencyCode: string
): Promise<number | null> {
  const milestones = getMilestonesForCurrency(currencyCode);
  
  // Get already achieved milestones from storage
  const achievedStr = await AsyncStorage.getItem(MONEY_MILESTONE_KEY);
  const achieved: number[] = achievedStr ? JSON.parse(achievedStr) : [];
  
  // Find milestones that are reached but not yet notified
  const newlyAchieved = milestones.filter(
    m => currentSaved >= m && !achieved.includes(m)
  );
  
  if (newlyAchieved.length === 0) return null;
  
  // Return the highest newly achieved milestone
  return Math.max(...newlyAchieved);
}

/**
 * Mark milestone as notified
 */
async function markMilestoneAchieved(milestone: number): Promise<void> {
  const achievedStr = await AsyncStorage.getItem(MONEY_MILESTONE_KEY);
  const achieved: number[] = achievedStr ? JSON.parse(achievedStr) : [];
  
  if (!achieved.includes(milestone)) {
    achieved.push(milestone);
    await AsyncStorage.setItem(MONEY_MILESTONE_KEY, JSON.stringify(achieved));
  }
}

/**
 * Check and send money saved milestone notification
 * Call this whenever money saved is updated
 */
export async function checkAndSendMoneySavedMilestone(
  currentSaved: number,
  currencyCode: string
): Promise<void> {
  const { areNotificationsEnabled } = await import("./notification-service");
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const milestone = await getNextMilestoneToNotify(currentSaved, currencyCode);
    
    if (!milestone) {
      console.log("📊 No new money milestone reached");
      return;
    }

    const message = getMilestoneMessage(milestone, currencyCode);

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { 
          type: "money_saved_milestone", 
          milestone, 
          currencyCode,
          currentSaved 
        },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    await markMilestoneAchieved(milestone);
    // console.log(`✅ Money milestone notification sent: ${formatAmount(milestone, currencyCode)}`);
  } catch (error) {
    console.error("❌ Error checking money milestone:", error);
  }
}

/**
 * Send immediate money milestone notification (for testing)
 */
export async function sendMoneySavedMilestoneNotification(
  amount: number,
  currencyCode: string
): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  try {
    const message = getMilestoneMessage(amount, currencyCode);

    await Notif.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: true,
        data: { type: "money_saved_milestone", milestone: amount, currencyCode },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    // console.log(`✅ Money milestone notification sent: ${formatAmount(amount, currencyCode)}`);
  } catch (error) {
    console.error("❌ Error sending money milestone notification:", error);
  }
}

/**
 * Clear milestone history (for testing)
 */
export async function clearMoneySavedMilestones(): Promise<void> {
  await AsyncStorage.removeItem(MONEY_MILESTONE_KEY);
  // console.log("✅ Money milestone history cleared");
}

/**
 * Get current milestones status (for debugging)
 */
export async function getMoneySavedMilestoneStatus(currencyCode: string): Promise<{
  milestones: number[];
  achieved: number[];
}> {
  const milestones = getMilestonesForCurrency(currencyCode);
  const achievedStr = await AsyncStorage.getItem(MONEY_MILESTONE_KEY);
  const achieved: number[] = achievedStr ? JSON.parse(achievedStr) : [];
  
  return { milestones, achieved };
}
