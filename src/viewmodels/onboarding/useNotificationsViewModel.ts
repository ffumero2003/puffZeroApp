// src/viewmodels/onboarding/useNotificationsViewModel.ts
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import {
    registerForPushNotifications,
    scheduleDailyLocalReminder,
    sendDailyQuoteNotification,
    sendWelcomeBackNotification,
    sendWelcomeNotification
} from "@/src/services/notifications/notification-service";

// 🔧 SET TO TRUE FOR TESTING
const TEST_MODE = __DEV__;

export function useNotificationsViewModel() {
  const { user } = useAuth();

  /**
   * Request notification permissions and register for push notifications
   */
  async function requestPermission(): Promise<boolean> {
    try {
      const token = await registerForPushNotifications();
      
      console.log("✅ Notification permission granted!");
      console.log("📱 Push token:", token);

      // If we have a token and a user, save it to their profile
      if (token && user?.id) {
        await savePushTokenToProfile(token);
      }

      // Schedule local daily reminder as fallback
      await scheduleDailyLocalReminder();

      // 🧪 TEST: Send a test notification immediately in dev mode
      if (TEST_MODE) {
        await sendTestNotification();
      }

      return true;
    } catch (error) {
      console.error("❌ Error requesting notifications:", error);
      return false;
    }
  }

  /**
   * Save push token to user's profile in Supabase
   */
  async function savePushTokenToProfile(token: string): Promise<void> {
    if (!user?.id) {
      console.log("⚠️ No user ID, cannot save push token");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ push_token: token })
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Error saving push token:", error);
      } else {
        console.log("✅ Push token saved to profile");
      }
    } catch (error) {
      console.error("❌ Error saving push token:", error);
    }
  }

  /**
   * Skip permission request
   */
  function skipPermission(): boolean {
    console.log("⏭️ User skipped notification permission");
    return true;
  }

  /**
   * 🧪 Test function - sends a local notification immediately
   */
  async function sendTestNotification(): Promise<void> {
    console.log("🧪 Sending test notification...");

    const Notifications = await import("expo-notifications");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💨 PuffZero Test",
        body: "¡Las notificaciones funcionan! 🎉",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    console.log("✅ Test notification scheduled!");
  }

  /**
   * 🧪 Test function - fetch today's AI quote and show as notification
   */
  async function testDailyQuoteNotification(): Promise<string | null> {
    console.log("🧪 Testing daily quote notification...");

    try {
      const { data, error } = await supabase.functions.invoke("generate-quote", {
        body: { percentage: 0 },
      });

      if (error) throw error;

      const quote = data?.quote || "Tu fuerza interior es más grande que cualquier antojo.";

      console.log("📝 Quote received:", quote);

      await sendDailyQuoteNotification(quote);

      console.log("✅ Quote notification sent!");
      return quote;
    } catch (error) {
      console.error("❌ Error testing quote notification:", error);
      
      // Send fallback quote
      const fallbackQuote = "Cada día sin vape es una victoria que celebrar.";
      await sendDailyQuoteNotification(fallbackQuote);
      return fallbackQuote;
    }
  }

  /**
   * 🧪 Test welcome notification (for new users)
   */
  async function testWelcomeNotification(): Promise<void> {
    console.log("🧪 Testing welcome notification...");
    await sendWelcomeNotification();
    console.log("✅ Welcome notification sent!");
  }

  /**
   * 🧪 Test welcome back notification (for returning users)
   */
  async function testWelcomeBackNotification(): Promise<void> {
    console.log("🧪 Testing welcome back notification...");
    const firstName = user?.user_metadata?.full_name?.split(" ")[0];
    await sendWelcomeBackNotification(firstName);
    console.log("✅ Welcome back notification sent!");
  }

  return {
    requestPermission,
    skipPermission,
    sendTestNotification,
    testDailyQuoteNotification,
    testWelcomeNotification,
    testWelcomeBackNotification,
    savePushTokenToProfile,
  };
}