import AppText from "@/src/components/AppText";
import { isDevMode } from "@/src/config/dev";
import { devResetApp } from "@/src/config/dev-reset";
import { Colors } from "@/src/constants/theme";
import { useAuth } from "@/src/providers/auth-provider";
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/(onboarding)/onboarding");
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText weight="bold" style={styles.title}>
            Perfil 👤
          </AppText>
          <AppText style={styles.subtitle}>
            Gestiona tu cuenta
          </AppText>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <AppText weight="bold" style={styles.cardTitle}>
            Tu Cuenta
          </AppText>

          <View style={styles.infoRow}>
            <AppText style={styles.label}>📧 Email:</AppText>
            <AppText weight="medium" style={styles.value}>
              {user?.email}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <AppText style={styles.label}>👤 Nombre:</AppText>
            <AppText weight="medium" style={styles.value}>
              {userName}
            </AppText>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <AppText weight="bold" style={styles.buttonText}>
              🚪 Cerrar Sesión
            </AppText>
          </TouchableOpacity>

          {isDevMode() && (
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={devResetApp}
              activeOpacity={0.7}
            >
              <AppText weight="bold" style={[styles.buttonText, { color: "#000" }]}>
                🔁 Reset App (DEV)
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    opacity: 0.7,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.light.primary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
    textAlign: "right",
  },
  actionsSection: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: Colors.light.primary,
  },
  resetButton: {
    backgroundColor: "#FFD700",
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
});