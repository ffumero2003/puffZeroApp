// src/viewmodels/onboarding/useNotificationsViewModel.ts
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { sendDailyQuoteNotification } from "@/src/services/notifications/daily-quote-notification";
import { scheduleDailyLocalReminder } from "@/src/services/notifications/daily-reminder-notification";
import { sendWelcomeBackNotification } from "@/src/services/notifications/welcome-back-notification";
import { sendWelcomeNotification } from "@/src/services/notifications/welcome-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";



export function useNotificationsViewModel() {
  const { user } = useAuth();

  /**
   * Request notification permissions and schedule local notifications
   * (Push tokens removed - using local notifications only)
   */
  async function requestPermission(): Promise<boolean> {
    try {
      // Import expo-notifications to request permission
      const Notifications = await import("expo-notifications");
      
      // Request permission from the user
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== "granted") {
        console.log("⚠️ Notification permission denied");
        return false;
      }

      // console.log("✅ Notification permission granted!");

            // Schedule local daily reminder
      await scheduleDailyLocalReminder();

      // Persist that notifications are enabled so other services can check
      await AsyncStorage.setItem("notifications_enabled", "true");

      return true;

    } catch (error) {
      console.error("❌ Error requesting notifications:", error);
      return false;
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
  ...__DEV__ && {
    testDailyQuoteNotification,
    testWelcomeNotification,
    testWelcomeBackNotification,
  },
};

}
