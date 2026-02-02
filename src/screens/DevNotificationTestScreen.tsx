import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import all notification functions

// Add these imports with the other notification imports
import {
  cancelInactivityNotifications,
  scheduleInactivityNotifications,
  sendInactivityNotification,
  updateLastActivity,
} from "@/src/services/notifications/inactivity-notification";

import {
  cancelWeeklySummaryNotification,
  scheduleWeeklySummaryNotification,
  sendWeeklySummaryNotification,
} from "@/src/services/notifications/weekly-summary-notification";

import {
  checkAndSendFirstPuffFreeDayNotification,
  resetFirstPuffFreeDayTracking,
  scheduleEndOfDayPuffFreeCheck,
  sendFirstPuffFreeDayNotification,
} from "@/src/services/notifications/first-puff-free-day-notification";

import {
  scheduleDailyAchievementCheck,
  sendDailyAchievementNotification,
} from "@/src/services/notifications/daily-achievement-notification";
import { sendDailyQuoteNotification } from "@/src/services/notifications/daily-quote-notification";
import { scheduleDailyLocalReminder } from "@/src/services/notifications/daily-reminder-notification";
import { checkandSendMilestoneNotification } from "@/src/services/notifications/milestone-notification";
import {
  areNotificationsEnabled,
  sendTestNotification,
} from "@/src/services/notifications/notification-service";
import { scheduleVerificationReminder } from "@/src/services/notifications/verification-notification";
import { sendWelcomeBackNotification } from "@/src/services/notifications/welcome-back-notification";
import { sendWelcomeNotification } from "@/src/services/notifications/welcome-notification";

import {
  checkAndSendMoneySavedMilestone,
  clearMoneySavedMilestones,
  sendMoneySavedMilestoneNotification,
} from "@/src/services/notifications/money-saved-milestone-notification";

export function DevNotificationTestScreen() {
  const [status, setStatus] = useState<string>("Ready to test");

  const showResult = (message: string) => {
    setStatus(message);
    console.log("[NotificationTest]", message);
  };

  const testBasicNotification = async () => {
    try {
      showResult("Sending basic notification...");
      await sendTestNotification();
      showResult("✅ Basic notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testWelcome = async () => {
    try {
      showResult("Sending welcome notification...");
      await sendWelcomeNotification();
      showResult("✅ Welcome notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testWelcomeBack = async () => {
    try {
      showResult("Sending welcome back notification...");
      await sendWelcomeBackNotification("Test User");
      showResult("✅ Welcome back notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testDailyQuote = async () => {
    try {
      showResult("Fetching quote and sending notification...");
      // You may need to fetch the quote first from your Supabase function
      // For now, test with a hardcoded quote
      await sendDailyQuoteNotification(
        "Cada día sin fumar es una victoria. ¡Sigue adelante!",
      );
      showResult("✅ Daily quote notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testDailyReminder = async () => {
    try {
      showResult("Scheduling daily reminder...");
      await scheduleDailyLocalReminder();
      showResult("✅ Daily reminder scheduled for 8 AM!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testVerificationReminder = async () => {
    try {
      showResult("Scheduling verification reminder...");
      await scheduleVerificationReminder();
      showResult("✅ Verification reminder scheduled!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testMilestone = async () => {
    try {
      showResult("Clearing milestone history and testing...");
      // Clear previous milestones first
      await AsyncStorage.removeItem("milestone_notification_sent");

      // Simulate 25% progress (8 days into a 30-day goal)
      const fakeStartDate = new Date();
      fakeStartDate.setDate(fakeStartDate.getDate() - 8);

      await checkandSendMilestoneNotification(fakeStartDate.toISOString(), 30);
      showResult("✅ Milestone notification sent (if threshold met)!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const checkPermissions = async () => {
    try {
      const enabled = await areNotificationsEnabled();
      showResult(`Notifications enabled: ${enabled ? "✅ YES" : "❌ NO"}`);
    } catch (error) {
      showResult(`❌ Error checking permissions: ${error}`);
    }
  };

  const clearAllNotificationData = async () => {
    try {
      await AsyncStorage.multiRemove([
        "expo_push_token",
        "notifications_enabled",
        "milestone_notification_sent",
        "money_milestone_achieved",
        // New notification data
        "last_activity_timestamp",
        "inactivity_notifications_sent",
        "first_puff_free_day_notification_sent",
      ]);
      // Cancel scheduled notifications
      await cancelInactivityNotifications();
      await cancelWeeklySummaryNotification();
      showResult("✅ All notification data cleared!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testDailyAchievement = async () => {
    try {
      showResult("Sending daily achievement notification...");
      // Test with 15 puffs out of 30 daily goal (50%)
      await sendDailyAchievementNotification(15, 30);
      showResult("✅ Daily achievement notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testScheduleAchievement = async () => {
    try {
      showResult("Scheduling daily achievement check...");
      await scheduleDailyAchievementCheck();
      showResult("✅ Daily achievement scheduled for 8 PM!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testMoneySavedMilestone = async () => {
    try {
      showResult("Sending money saved milestone notification...");
      // Test with CRC currency (Costa Rican Colones)
      await sendMoneySavedMilestoneNotification(50000, "CRC"); // ~$25 equivalent
      showResult("✅ Money milestone notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testCheckMoneySavedMilestone = async () => {
    try {
      showResult("Clearing history and checking milestone...");
      await clearMoneySavedMilestones();

      // Simulate having saved 30,000 CRC (~$60)
      await checkAndSendMoneySavedMilestone(30000, "CRC");
      showResult("✅ Money milestone check complete!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  // ===== INACTIVITY NOTIFICATIONS =====
  const testInactivity24h = async () => {
    try {
      showResult("Sending 24h inactivity notification...");
      await sendInactivityNotification(24);
      showResult("✅ 24h inactivity notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testInactivity48h = async () => {
    try {
      showResult("Sending 48h inactivity notification...");
      await sendInactivityNotification(48);
      showResult("✅ 48h inactivity notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testInactivity72h = async () => {
    try {
      showResult("Sending 72h inactivity notification...");
      await sendInactivityNotification(72);
      showResult("✅ 72h inactivity notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testScheduleInactivity = async () => {
    try {
      showResult("Scheduling inactivity notifications...");
      await scheduleInactivityNotifications();
      showResult("✅ Inactivity notifications scheduled for 24h, 48h, 72h!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testUpdateActivity = async () => {
    try {
      showResult("Updating last activity...");
      await updateLastActivity();
      showResult("✅ Activity updated! Inactivity timers reset.");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  // ===== WEEKLY SUMMARY NOTIFICATIONS =====
  const testWeeklySummary = async () => {
    try {
      showResult("Sending weekly summary notification...");
      // Use a test user ID - replace with actual if needed
      await sendWeeklySummaryNotification(
        "test-user-id",
        50000, // money per month
        "CRC", // currency
      );
      showResult("✅ Weekly summary notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testScheduleWeeklySummary = async () => {
    try {
      showResult("Scheduling weekly summary...");
      await scheduleWeeklySummaryNotification();
      showResult("✅ Weekly summary scheduled for Sundays at 8 PM!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  // ===== FIRST PUFF-FREE DAY NOTIFICATIONS =====
  const testFirstPuffFreeDay = async () => {
    try {
      showResult("Sending first puff-free day notification...");
      await sendFirstPuffFreeDayNotification();
      showResult("✅ First puff-free day notification sent!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testCheckPuffFreeDay = async () => {
    try {
      showResult("Checking for puff-free day...");
      await resetFirstPuffFreeDayTracking(); // Reset first to allow re-testing
      await checkAndSendFirstPuffFreeDayNotification();
      showResult("✅ Puff-free day check complete!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const testSchedulePuffFreeCheck = async () => {
    try {
      showResult("Scheduling end-of-day puff-free check...");
      await resetFirstPuffFreeDayTracking();
      await scheduleEndOfDayPuffFreeCheck();
      showResult("✅ Puff-free check scheduled for 11:59 PM!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  const clearNewNotificationData = async () => {
    try {
      await AsyncStorage.multiRemove([
        "last_activity_timestamp",
        "inactivity_notifications_sent",
        "first_puff_free_day_notification_sent",
      ]);
      await cancelInactivityNotifications();
      await cancelWeeklySummaryNotification();
      showResult("✅ New notification data cleared!");
    } catch (error) {
      showResult(`❌ Error: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔔 Notification Test Panel</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      <Text style={styles.sectionTitle}>Permissions</Text>
      <TouchableOpacity style={styles.button} onPress={checkPermissions}>
        <Text style={styles.buttonText}>Check Permissions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={requestPermissions}>
        <Text style={styles.buttonText}>Request Permissions</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Immediate Notifications</Text>
      <TouchableOpacity style={styles.button} onPress={testBasicNotification}>
        <Text style={styles.buttonText}>1. Test Basic Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testWelcome}>
        <Text style={styles.buttonText}>2. Test Welcome</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testWelcomeBack}>
        <Text style={styles.buttonText}>3. Test Welcome Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testDailyQuote}>
        <Text style={styles.buttonText}>4. Test Daily Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testMilestone}>
        <Text style={styles.buttonText}>
          5. Test Milestone (clears history)
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Scheduled Notifications</Text>
      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={testDailyReminder}
      >
        <Text style={styles.buttonText}>6. Schedule Daily Reminder (8 AM)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={testVerificationReminder}
      >
        <Text style={styles.buttonText}>7. Schedule Verification Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testDailyAchievement}>
        <Text style={styles.buttonText}>8. Test Daily Achievement</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={testScheduleAchievement}
      >
        <Text style={styles.buttonText}>9. Schedule Achievement (8 PM)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testMoneySavedMilestone}>
        <Text style={styles.buttonText}>10. Test Money Milestone</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={testCheckMoneySavedMilestone}
      >
        <Text style={styles.buttonText}>
          11. Check Money Milestone (clears history)
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Inactivity Notifications</Text>
      <TouchableOpacity style={styles.button} onPress={testInactivity24h}>
        <Text style={styles.buttonText}>12. Test Inactivity (24h)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testInactivity48h}>
        <Text style={styles.buttonText}>13. Test Inactivity (48h)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testInactivity72h}>
        <Text style={styles.buttonText}>14. Test Inactivity (72h)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={testScheduleInactivity}
      >
        <Text style={styles.buttonText}>
          15. Schedule Inactivity (24/48/72h)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testUpdateActivity}>
        <Text style={styles.buttonText}>
          16. Update Activity (Reset Timers)
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Weekly Summary</Text>
      <TouchableOpacity style={styles.button} onPress={testWeeklySummary}>
        <Text style={styles.buttonText}>17. Test Weekly Summary</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={testScheduleWeeklySummary}
      >
        <Text style={styles.buttonText}>
          18. Schedule Weekly (Sundays 8 PM)
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>First Puff-Free Day</Text>
      <TouchableOpacity style={styles.button} onPress={testFirstPuffFreeDay}>
        <Text style={styles.buttonText}>19. Test First Puff-Free Day</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={testCheckPuffFreeDay}>
        <Text style={styles.buttonText}>20. Check Puff-Free Day (resets)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.scheduledButton]}
        onPress={testSchedulePuffFreeCheck}
      >
        <Text style={styles.buttonText}>
          21. Schedule Puff-Free Check (11:59 PM)
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Utilities</Text>
      <TouchableOpacity
        style={[styles.button, styles.dangerButton]}
        onPress={clearAllNotificationData}
      >
        <Text style={styles.buttonText}>Clear All Notification Data</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Background the app after pressing a button to see the
          notification banner
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8b8b9e",
    marginTop: 20,
    marginBottom: 10,
  },
  statusBox: {
    backgroundColor: "#252542",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusLabel: {
    color: "#8b8b9e",
    fontSize: 12,
    marginBottom: 5,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#5974FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scheduledButton: {
    backgroundColor: "#9b59b6",
  },
  dangerButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    marginTop: 30,
    marginBottom: 50,
    padding: 15,
    backgroundColor: "#252542",
    borderRadius: 10,
  },
  footerText: {
    color: "#8b8b9e",
    fontSize: 13,
    textAlign: "center",
  },
});
