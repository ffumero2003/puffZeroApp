// src/components/app/settings/SettingsActions.tsx
// Logout and Delete Account buttons

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SettingsActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function SettingsActions({
  onLogout,
  onDeleteAccount,
}: SettingsActionsProps) {
  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <AppText weight="bold" style={styles.logoutText}>
          Cerrar Sesión
        </AppText>
      </TouchableOpacity>

      {/* Delete Account Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDeleteAccount}
        activeOpacity={0.7}
      >
        <AppText weight="bold" style={styles.deleteText}>
          Eliminar Cuenta
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    gap: 12,
  },
  logoutButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: Colors.light.danger,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    opacity: 0.8,
  },
  deleteText: {
    color: "#fff",
    fontSize: 18,
  },
});
