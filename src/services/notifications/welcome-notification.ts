// src/services/notifications/welcome-notification.ts
import { getNotifications } from "./notification-service";

// ============================================
// LOCAL NOTIFICATION FUNCTIONS
// ============================================

/**
 * Send welcome notification for new users (registration)
 */
export async function sendWelcomeNotification(): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  const welcomeMessages = [
    {
      title: "🎉 ¡Bienvenido a PuffZero!",
      body: "Bienvenido a tu nueva vida. Estamos aquí para acompañarte en cada paso.",
    },
    {
      title: "💪 ¡Comenzaste tu viaje!",
      body: "Bienvenido a tu nueva vida sin dependencias. ¡Vamos a lograrlo juntos!",
    },
    {
      title: "🌟 ¡Hola, campeón!",
      body: "Bienvenido a tu nueva vida. Hoy es el primer día de tu mejor versión.",
    },
  ];

  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "welcome", action: "registration" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log("✅ Welcome notification scheduled");
  } catch (error) {
    console.error("❌ Error sending welcome notification:", error);
  }
}