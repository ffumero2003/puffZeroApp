// src/services/notifications/milestone-notification.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { areNotificationsEnabled, getNotifications } from "./notification-service";


const MILESTONE_NOTIFICATION_KEY = "milestone_notification_sent";

// MILESTONE NOTIFICATION FUNCTION

const MILESTONE_PERCENTAGES = [10, 25, 50, 75, 100];

//GET MILESTONE MESSAGES BASED ON PERCENTAGE

function getMilestoneMessage(percentage: number, goalSpeedDays: number): { title: string, body: string } {
  const messages: Record<number, { title: string, body: string }[]> = {
    10: [
      { title: "🚀 ¡10% completado!", body: `Ya llevas el 10% de tu plan de ${goalSpeedDays} días. ¡Gran comienzo!` },
      { title: "💪 ¡Primer hito alcanzado!", body: "El 10% ya es tuyo. Cada paso cuenta." },
    ],
    25: [
      { title: "🔥 ¡25% del camino!", body: `Un cuarto de tu plan de ${goalSpeedDays} días completado. ¡Sigue así!` },
      { title: "⭐ ¡Cuarto del camino!", body: "25% logrado. Tu determinación es increíble." },
    ],
    50: [
      { title: "🎯 ¡Llegaste a la mitad!", body: `50% de tu plan de ${goalSpeedDays} días. ¡Eres imparable!` },
      { title: "💥 ¡Mitad del camino!", body: "50% completado. La meta está cada vez más cerca." },
    ],
    75: [
      { title: "🏆 ¡75% completado!", body: `Solo falta un cuarto para terminar tu plan de ${goalSpeedDays} días.` },
      { title: "⚡ ¡Ya casi llegas!", body: "75% logrado. La recta final está aquí." },
    ],
    100: [
      { title: "🎉 ¡LO LOGRASTE!", body: `Completaste tu plan de ${goalSpeedDays} días. ¡Eres un campeón!` },
      { title: "🏅 ¡META ALCANZADA!", body: `${goalSpeedDays} días completados. Tu nueva vida comienza ahora.` },
    ],
  };

  const options = messages[percentage] || messages[10];
  return options[Math.floor(Math.random() * options.length)];
}

async function getSentMilestone(): Promise<number[]> {
  try{ 
    const stored = await AsyncStorage.getItem(MILESTONE_NOTIFICATION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

async function markMilestoneSent(percentage: number): Promise<void> {
  try{
    const sent = await getSentMilestone();
    if(!sent.includes(percentage)){
      sent.push(percentage)
      await AsyncStorage.setItem(MILESTONE_NOTIFICATION_KEY, JSON.stringify(sent));
    }
  } catch (error){
    console.log("⚠️ Error marking milestone sent:", error);
  }
}

/**
 * Check and send milestone notification if a new milestone is reached
 * Call this whenever progress is updated (e.g., in useProgressViewModel or on app open)
 * 
 * @param profileCreatedAt - The date the user's profile was created
 * @param goalSpeedDays - The user's goal speed in days (14, 21, 30, 60, or 90)
 */

export async function checkandSendMilestoneNotification(
  profileCreatedAt: string,
  goalSpeedDays: number
): Promise<void> {
  const Notif = await getNotifications();
  if(!Notif) return;

  // Check if notifications are enabled
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  // calculate percentage
  const now = new Date();
  const daysPassed = (now.getTime() - new Date(profileCreatedAt).getTime()) / (1000 * 60 * 60 * 24);
  const currentPercentage = Math.min(100, (daysPassed / goalSpeedDays) * 100);

  // Get already sent milestones
  const sentMilestones = await getSentMilestone();

  //find highest mileston that should be sent
  for (const milestone of MILESTONE_PERCENTAGES) {
    if (currentPercentage >= milestone && !sentMilestones.includes(milestone)) {
      const message = getMilestoneMessage(milestone, goalSpeedDays);
      
      try{
        await Notif.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            sound: true,
            data: { type: "milestone", percentage: milestone, goalSpeedDays },
          },
          trigger: {
            type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 2,
          },
        });
        
        await markMilestoneSent(milestone);
        console.log(`✅ Milestone notification sent: ${milestone}%`);
      } catch (error) {
        console.error(`❌ Error sending milestone notification:`, error);
      }
    }
  }
}

/**
 * Reset milestone notifications (e.g., if user restarts their plan)
 */
export async function resetMilestoneNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MILESTONE_NOTIFICATION_KEY);
    console.log("✅ Milestone notifications reset");
  } catch (error) {
    console.error("❌ Error resetting milestones:", error);
  }
}