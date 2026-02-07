// app/(app)/settings.tsx
// Settings screen - clean and organized using components

import EmailInputModal from "@/src/components/app/settings/EmailInputModal";
import InputModal from "@/src/components/app/settings/InputModal";
import SettingsActions from "@/src/components/app/settings/SettingsActions";
import SettingsHeader from "@/src/components/app/settings/SettingsHeader";
import SettingsRow from "@/src/components/app/settings/SettingsRow";
import SettingsSection from "@/src/components/app/settings/SettingsSection";
import SupportModal from "@/src/components/app/settings/SupportModal";
import { VerificationStatus } from "@/src/components/app/settings/VerificationStatus";
import { Colors } from "@/src/constants/theme";
import { useAuth } from "@/src/providers/auth-provider";
import { deleteAccount } from "@/src/services/auth-services";
import { useSettingsViewModel } from "@/src/viewmodels/app/useSettingsViewModel";

import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

export default function Settings() {
  const { signOut, user } = useAuth();
  const vm = useSettingsViewModel();

  // Modal visibility states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPuffsModal, setShowPuffsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // ============================================
  // Handlers
  // ============================================
  const handleLogout = async () => {
    await signOut();
    router.replace("/(onboarding)/onboarding");
  };

  const handleDeleteAccount = async () => {
    try {
      const userId = user?.id;
      if (!userId) return;

      // Call edge function to delete all user data + auth account
      const { error } = await deleteAccount(userId);

      if (error) {
        console.error("❌ Failed to delete account:", error.message);
        return;
      }

      // Sign out locally and go to onboarding
      await signOut();
      router.replace("/(onboarding)/onboarding");
    } catch (error) {
      console.error("❌ Error deleting account:", error);
    }
  };

  // ============================================
  // Loading state
  // ============================================
  if (vm.loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <View style={styles.container}>
      <SettingsHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <SettingsSection title="Perfil">
          {/* Correo - editable */}
          <SettingsRow
            label="Correo"
            value={vm.email}
            onPress={() => setShowEmailModal(true)}
          />

          {/* Meta Diaria - editable */}
          <SettingsRow
            label="Meta Diaria"
            value={`${vm.puffsPerDay} puffs`}
            onPress={() => setShowPuffsModal(true)}
          />

          {/* Gasto Mensual - read only with currency symbol */}
          <SettingsRow
            label="Gasto Mensual"
            value={vm.getFormattedMoney()}
            showChevron={false}
          />

          {/* Goal - read only */}
          <SettingsRow
            label="Meta"
            value={vm.getGoalLabel()}
            showChevron={false}
          />

          {/* Why Stopped - read only */}
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
                trackColor={{ false: "#ccc", true: Colors.light.primary }}
                thumbColor="#fff"
              />
            }
            isLast={true}
          />
        </SettingsSection>

        {/* About Section */}
        <SettingsSection title="Acerca de">
          <SettingsRow
            label="Politica de Privacidad"
            onPress={() => router.push("/privacy-policy")}
          />
          <SettingsRow
            label="Términos y Condiciones"
            onPress={() => router.push("/terms-of-use")}
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

        {/* Action Buttons */}
        <SettingsActions
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      </ScrollView>

      {/* ============================================ */}
      {/* MODALS */}
      {/* ============================================ */}

      {/* Email Input */}
      <EmailInputModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSave={vm.saveEmail}
        initialValue={vm.email}
      />

      {/* Puffs Input - with validation */}
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

      {/* Support Contact */}
      <SupportModal
        visible={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
});
