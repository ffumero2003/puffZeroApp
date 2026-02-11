// app/(app)/settings.tsx
// Settings screen - clean and organized using components

import EmailInputModal from "@/src/components/app/settings/EmailInputModal";
import InputModal from "@/src/components/app/settings/InputModal";
import SettingsActions from "@/src/components/app/settings/SettingsActions";
import SettingsHeader from "@/src/components/app/settings/SettingsHeader";
import SettingsRow from "@/src/components/app/settings/SettingsRow";
import SettingsSection from "@/src/components/app/settings/SettingsSection";
import SupportModal from "@/src/components/app/settings/SupportModal";
import ThemePickerModal from "@/src/components/app/settings/ThemePickerModal";
import { VerificationStatus } from "@/src/components/app/settings/VerificationStatus";
// NEW: Import useThemeColors for dynamic colors
import { useThemeColors } from "@/src/providers/theme-provider";
import RevenueCatUI from "react-native-purchases-ui";

// NEW: Import useTheme for theme preference getter/setter
import { useAuth } from "@/src/providers/auth-provider";
import { useTheme } from "@/src/providers/theme-provider";
import { deleteAccount } from "@/src/services/auth-services";
import { useSettingsViewModel } from "@/src/viewmodels/app/useSettingsViewModel";

import { ROUTES } from "@/src/constants/routes";
import { supabase } from "@/src/lib/supabase";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

// NEW: Labels for the theme options (in Spanish to match your app)
const THEME_LABELS: Record<string, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
};

export default function Settings() {
  const { resetAll } = useOnboarding();
  const { signOut, user } = useAuth();
  const vm = useSettingsViewModel();
  // NEW: Get theme preference and setter
  const { themePreference, setThemePreference } = useTheme();
  // NEW: Get dynamic colors
  const colors = useThemeColors();

  // Modal visibility states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPuffsModal, setShowPuffsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  // NEW: State for theme picker modal
  const [showThemeModal, setShowThemeModal] = useState(false);

  // ============================================
  // Handlers
  // ============================================
  const handleLogout = async () => {
    await signOut();
  };

  // Opens RevenueCat's Customer Center (manage subscription, cancel, restore)
  const handleManageSubscription = async () => {
    try {
      await RevenueCatUI.presentCustomerCenter();
    } catch (e) {
      console.error("Error presenting Customer Center:", e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = user?.id;
      if (!userId) return;

      // Step 1: Call the edge function to delete all user data from Supabase
      const { error } = await deleteAccount(userId);

      if (error) {
        console.error("❌ Failed to delete account:", error.message);
        return;
      }

      // Step 2: Clear ALL local AsyncStorage keys tied to this user
      // This prevents stale data from leaking to a new account on the same device
      await AsyncStorage.multiRemove([
        "postSignupCompleted",
        "onboardingCompleted",
        "onboarding_name",
        "profile_created_at",
        "notifications_enabled",
        "theme_preference",
      ]);

      // Step 3: Reset the in-memory onboarding state
      resetAll();

      // Step 4: Sign out from Supabase (clears session token locally)
      // We call supabase.auth.signOut() directly instead of the signOut()
      // from auth provider, because signOut() sets postSignupCompleted to true,
      // which we just cleared. We want it to stay cleared.
      await supabase.auth.signOut();

      // Step 5: No explicit navigation needed — AuthGuard detects user becomes
      // null and automatically redirects to /(onboarding)/onboarding
    } catch (error) {
      console.error("❌ Error deleting account:", error);
    }
  };

  // ============================================
  // Loading state
  // ============================================
  if (vm.loading) {
    return (
      // NEW: Dynamic background color
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    // NEW: Dynamic background color
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SettingsHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <SettingsSection title="Perfil">
          <SettingsRow
            label="Correo"
            value={vm.email}
            onPress={() => setShowEmailModal(true)}
          />
          <SettingsRow
            label="Meta Diaria"
            value={`${vm.puffsPerDay} puffs`}
            onPress={() => setShowPuffsModal(true)}
          />
          <SettingsRow
            label="Gasto Mensual"
            value={vm.getFormattedMoney()}
            showChevron={false}
          />
          <SettingsRow
            label="Meta"
            value={vm.getGoalLabel()}
            showChevron={false}
          />
          <SettingsRow
            label="Motivación"
            value={vm.getWhyStoppedLabel()}
            showChevron={false}
          />
          <VerificationStatus />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notificaciones">
          <SettingsRow
            label="Recordatorios Diarios"
            rightElement={
              <Switch
                value={vm.notificationsEnabled}
                onValueChange={vm.toggleNotifications}
                // NEW: Dynamic switch track color
                trackColor={{
                  false: colors.switchTrackOff,
                  true: colors.primary,
                }}
                thumbColor="#fff"
              />
            }
            isLast={true}
          />
        </SettingsSection>

        {/* NEW: Appearance Section - Theme picker */}
        <SettingsSection title="Apariencia">
          <SettingsRow
            label="Tema"
            value={THEME_LABELS[themePreference]}
            onPress={() => setShowThemeModal(true)}
            isLast={true}
          />
        </SettingsSection>

        {/* Subscription Section */}
        <SettingsSection title="Suscripción">
          <SettingsRow
            label="Gestionar Suscripción"
            onPress={handleManageSubscription}
            isLast={true}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="Acerca de">
          <SettingsRow
            label="Politica de Privacidad"
            onPress={() => router.push(ROUTES.PRIVACY_POLICY)}
          />
          <SettingsRow
            label="Términos y Condiciones"
            onPress={() => router.push(ROUTES.TERMS_OF_USE)}
          />
          <SettingsRow
            label="Contactar Soporte"
            onPress={() => setShowSupportModal(true)}
          />
          <SettingsRow
            label="Versión"
            value="1.0.0"
            showChevron={false}
            isLast={true}
          />
        </SettingsSection>

        <SettingsActions
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      </ScrollView>

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      <EmailInputModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSave={vm.saveEmail}
        initialValue={vm.email}
      />

      <InputModal
        visible={showPuffsModal}
        onClose={() => setShowPuffsModal(false)}
        onSave={vm.savePuffsPerDay}
        title="Meta Diaria de Puffs"
        initialValue={vm.puffsPerDay}
        placeholder="Ej: 200"
        validate={vm.isValidPuffs}
        errorMessage="Debe estar entre 20 y 1000 puffs"
        minValueHint={vm.getPuffsHint()}
      />

      <SupportModal
        visible={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      {/* NEW: Theme Picker Modal */}
      <ThemePickerModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        selectedValue={themePreference}
        onSelect={setThemePreference}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  // NEW: Modal styles for the theme picker
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
});
