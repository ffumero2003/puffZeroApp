// useNotificationsViewModel.ts
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import * as Notifications from "expo-notifications";

// 🔧 SET TO TRUE FOR TESTING
const TEST_MODE = true;

export function useNotificationsViewModel() {
  const { user } = useAuth();

  async function requestPermission() {
    try {
      // Configure how notifications appear when app is in foreground
      // Notifications.setNotificationHandler({
      //   handleNotification: async () => ({
      //     shouldShowAlert: true,
      //     shouldPlaySound: true,
      //     shouldSetBadge: false,
      //     shouldShowBanner: true,
      //     shouldShowList: true,
      //   }),
      // });

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Permission not granted");
        return false;
      }

      console.log("✅ Notification permission granted!");

      // 🧪 TEST: Send a local notification immediately
      if (TEST_MODE) {
        await sendTestNotification();
      }

      return true;
    } catch (error) {
      console.error("❌ Error requesting notifications:", error);
      return false;
    }
  }

  // 🧪 Test function - sends a local notification
  async function sendTestNotification() {
    console.log("🧪 Sending test notification...");

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

  // 🧪 Test function - fetch today's AI quote and show as notification
  async function testDailyQuoteNotification() {
    console.log("🧪 Testing daily quote notification...");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    try {
      const { data, error } = await supabase.functions.invoke("generate-quote", {
        body: { percentage: 0 },
      });

      if (error) throw error;

      const quote = data?.quote || "Tu fuerza interior es más grande que cualquier antojo.";

      console.log("📝 Quote received:", quote);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💨 Tu frase del día",
          body: quote,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 1,
        },
      });

      console.log("✅ Quote notification sent!");
      return quote;
    } catch (error) {
      console.error("❌ Error testing quote notification:", error);
      return null;
    }
  }

  function skipPermission() {
    return true;
  }

  return {
    requestPermission,
    skipPermission,
    sendTestNotification,
    testDailyQuoteNotification,
  };
}