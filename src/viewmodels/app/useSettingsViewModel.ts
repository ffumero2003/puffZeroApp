// src/viewmodels/app/useSettingsViewModel.ts
// ViewModel for the Settings screen
// Handles loading/saving user preferences to Supabase and AsyncStorage

import { CURRENCY_SYMBOLS } from "@/src/constants/currency";
import { useUserData } from "@/src/hooks/useUserData";
import { updateProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import {
  scheduleVerificationReminders,
} from "@/src/services/notifications/verification-notification";
import {
  storePendingEmailChange,
} from "@/src/services/verification/verification-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Keys for AsyncStorage
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";
const REMINDER_HOUR_KEY = "reminder_hour";

// ============================================
// Validation constants
// ============================================
const PUFFS_MIN = 20;
const PUFFS_MAX = 1000;

// ============================================
// Goal options mapping (for display)
// ============================================
const GOAL_LABELS: Record<string, string> = {
  reduce: "Monitorear y Reducir 📊",
  quit: "Dejar por Completo 🔥",
};

// ============================================
// Why stopped options mapping (for display)
// ============================================
const MOTIVATION_LABELS: Record<string, string> = {
  salud: "Salud ❤️",
  finanzas: "Libertad Financiera 💰",
  independencia: "Independencia 🔒",
  social: "Razones Sociales 🧑‍🤝‍🧑",
  crecimiento: "Crecimiento Personal 🌱",
  ansiedad: "Menos Ansiedad 😔",
  fitness: "Mejor condición física 🏃‍♂️",
};

export function useSettingsViewModel() {
  const { user, profile, loading: profileLoading, email: initialEmail } = useUserData();

  // ============================================
  // Editable state
  // ============================================
  const [email, setEmail] = useState<string>("");
  const [puffsPerDay, setPuffsPerDay] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [reminderHour, setReminderHour] = useState<number>(8); // Default 8 AM

  // Read-only fields (loaded from profile)
  const [currency, setCurrency] = useState<string>("CRC");
  const [moneyPerMonth, setMoneyPerMonth] = useState<number>(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [whyStopped, setWhyStopped] = useState<string[]>([]);

  // UI state
  const [saving, setSaving] = useState(false);
  const [asyncLoading, setAsyncLoading] = useState(true);

  // ============================================
  // Load AsyncStorage settings on mount (only once)
  // ============================================
  useEffect(() => {
    loadAsyncSettings();
  }, []);

  // ============================================
  // Load email from user
  // ============================================
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // ============================================
  // Load profile data when profile changes
  // ============================================
  useEffect(() => {
    if (profile) {
      setCurrency(profile.currency || "CRC");
      setPuffsPerDay(profile.puffs_per_day || 0);
      setMoneyPerMonth(profile.money_per_month || 0);
      setGoal(profile.goal || null);
      setWhyStopped(profile.why_stopped || []);
    }
  }, [profile]);

  // Load notification settings from AsyncStorage
  async function loadAsyncSettings() {
    try {
      const [notifEnabled, savedHour] = await Promise.all([
        AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY),
        AsyncStorage.getItem(REMINDER_HOUR_KEY),
      ]);

      // console.log("📱 Loaded from AsyncStorage:", { notifEnabled, savedHour });

      // Default to true if not set
      setNotificationsEnabled(notifEnabled !== "false");

      // Load saved hour or default to 8
      if (savedHour) {
        const parsedHour = parseInt(savedHour, 10);
        if (!isNaN(parsedHour)) {
          setReminderHour(parsedHour);
          console.log("⏰ Reminder hour loaded:", parsedHour);
        }
      }
    } catch (error) {
      console.error("Error loading settings from AsyncStorage:", error);
    } finally {
      setAsyncLoading(false);
    }
  }

  // ============================================
  // Validation functions
  // ============================================

  // Validate puffs per day
  function isValidPuffs(value: number): boolean {
    return value >= PUFFS_MIN && value <= PUFFS_MAX;
  }

  // Get puffs validation hint
  function getPuffsHint(): string {
    return `Entre ${PUFFS_MIN} y ${PUFFS_MAX} puffs`;
  }

  // Validate email format
  function isValidEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  // ============================================
  // Display helpers
  // ============================================

  // Format money with currency symbol (e.g., "$50" or "₡10,000")
  function getFormattedMoney(): string {
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    return `${symbol}${moneyPerMonth.toLocaleString()}`;
  }

  // Get goal label for display
  function getGoalLabel(): string {
    if (!goal) return "No definido";
    return GOAL_LABELS[goal] || goal;
  }

  // Get why stopped label for display
  function getWhyStoppedLabel(): string {
    if (!whyStopped || whyStopped.length === 0) return "No definido";

    // Return first motivation with label
    const firstReason = whyStopped[0];
    return MOTIVATION_LABELS[firstReason] || firstReason;
  }

  // ============================================
  // Save functions
  // ============================================

  // Save email to Supabase Auth
async function saveEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
  if (!isValidEmail(newEmail)) {
    return { success: false, error: "Correo inválido" };
  }

  // Don't proceed if it's the same email
  if (newEmail === email) {
    return { success: false, error: "El correo es el mismo" };
  }

  setSaving(true);

  try {
    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      console.error("❌ Error updating email:", error);
      return { success: false, error: error.message };
    }

    // Store pending email change
    await storePendingEmailChange(email, newEmail);
    await scheduleVerificationReminders("email_change");

    // DON'T update local email state yet - wait for verification
    // setEmail(newEmail); // ← Remove this line
    
    console.log("✅ Email change initiated:", newEmail);

    // Note: Supabase sends a confirmation email to the new address
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving email:", error);
    return { success: false, error: "Error al actualizar el correo" };
  } finally {
    setSaving(false);
  }
}

  // Save daily puff goal to Supabase
  async function savePuffsPerDay(newPuffs: number) {
    if (!user?.id) return;

    setPuffsPerDay(newPuffs);
    setSaving(true);

    try {
      await updateProfile(user.id, { puffs_per_day: newPuffs });
      console.log("✅ Puffs per day saved:", newPuffs);
    } catch (error) {
      console.error("❌ Error saving puffs per day:", error);
    } finally {
      setSaving(false);
    }
  }

  // Toggle notifications (AsyncStorage)
  async function toggleNotifications(enabled: boolean) {
    setNotificationsEnabled(enabled);

    try {
      await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, enabled.toString());
      console.log("✅ Notifications toggled:", enabled);
    } catch (error) {
      console.error("❌ Error saving notifications setting:", error);
    }
  }

  // Save reminder hour (AsyncStorage)
  async function saveReminderHour(hour: number) {
    setReminderHour(hour);

    try {
      await AsyncStorage.setItem(REMINDER_HOUR_KEY, hour.toString());
      console.log("✅ Reminder hour saved:", hour);

      // TODO: Reschedule the daily notification with new hour
    } catch (error) {
      console.error("❌ Error saving reminder hour:", error);
    }
  }

  // ============================================
  // Helpers
  // ============================================

  // Format hour for display (e.g., "8:00 AM")
  function formatHour(hour: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  }

  return {
    // Editable state
    email,
    puffsPerDay,
    notificationsEnabled,
    reminderHour,

    // Read-only state
    currency,
    moneyPerMonth,
    goal,
    whyStopped,

    // UI state
    loading: asyncLoading || profileLoading,
    saving,

    // Actions (editable fields only)
    saveEmail,
    savePuffsPerDay,
    toggleNotifications,
    saveReminderHour,

    // Validation
    isValidPuffs,
    isValidEmail,
    getPuffsHint,

    // Display helpers
    getFormattedMoney,
    getGoalLabel,
    getWhyStoppedLabel,
    formatHour,
  };
}
