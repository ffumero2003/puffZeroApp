// src/components/app/settings/SettingsActions.tsx
import AppText from "@/src/components/AppText";
// NEW: Dynamic colors
import { useThemeColors } from "@/src/providers/theme-provider";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface SettingsActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function SettingsActions({
  onLogout,
  onDeleteAccount,
}: SettingsActionsProps) {
  // NEW: Dynamic colors
  const colors = useThemeColors();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: onDeleteAccount,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* NEW: Dynamic button background color */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.primary }]}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <AppText weight="bold" style={styles.logoutText}>
          Cerrar Sesión
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.danger }]}
        onPress={handleDeleteAccount}
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
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteButton: {
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
