// src/services/notifications/welcome-back-notification.ts
import { getNotifications } from "./notification-service";

/**
 * Send welcome back notification for returning users (login)
 */
export async function sendWelcomeBackNotification(firstName?: string): Promise<void> {
  const Notif = await getNotifications();
  if (!Notif) return;

  const name = firstName ? ` ${firstName}` : "";
  
  const welcomeBackMessages = [
    {
      title: `🔥 ¡Hola de nuevo${name}!`,
      body: "Continúa convirtiéndote en tu mejor versión. Cada día cuenta.",
    },
    {
      title: `💪 ¡Bienvenido de vuelta${name}!`,
      body: "Tu progreso te espera. Sigue adelante con tu plan.",
    },
    {
      title: `🌟 ¡Qué bueno verte${name}!`,
      body: "Estás más cerca de tu meta. No te detengas ahora.",
    },
    {
      title: `⚡ ¡Volviste${name}!`,
      body: "Tu mejor versión te está esperando. ¡Vamos!",
    },
    {
      title: `🎯 ¡Hola${name}!`,
      body: "Cada login es un compromiso contigo. ¡Sigue así!",
    },
  ];

  const randomMessage = welcomeBackMessages[Math.floor(Math.random() * welcomeBackMessages.length)];

  try {
    await Notif.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        body: randomMessage.body,
        sound: true,
        data: { type: "welcome_back", action: "login" },
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    console.log("✅ Welcome back notification scheduled");
  } catch (error) {
    console.error("❌ Error sending welcome back notification:", error);
  }
}