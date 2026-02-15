// src/viewmodels/app/useSettingsViewModel.ts
// ViewModel for the Settings screen
// Handles loading/saving user preferences to Supabase and AsyncStorage

import { CURRENCY_SYMBOLS } from "@/src/constants/currency";
import { useUserData } from "@/src/hooks/useUserData";
import { updateProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import {
  scheduleVerificationReminder,
} from "@/src/services/notifications/verification-notification";
import {
  storePendingEmailChange,
} from "@/src/services/verification/verification-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Keys for AsyncStorage
const NOTIFICATIONS_ENABLED_KEY = "notifications_enabled";

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
      const notifEnabled = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);



      // Default to true if not set
      setNotificationsEnabled(notifEnabled !== "false");

      
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
    await scheduleVerificationReminder();

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

  

  // ============================================
  // Helpers
  // ============================================



  return {
    // Editable state
    email,
    puffsPerDay,
    notificationsEnabled,
  

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
 

    // Validation
    isValidPuffs,
    isValidEmail,
    getPuffsHint,

    // Display helpers
    getFormattedMoney,
    getGoalLabel,
    getWhyStoppedLabel,
  };
}
