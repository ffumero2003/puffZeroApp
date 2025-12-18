// app/(app)/home.tsx
import { router } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../src/components/AppText";
import { isDevMode } from "../../src/config/dev";
import { devResetApp } from "../../src/config/dev-reset";
import { Colors } from "../../src/constants/theme";
import { useAuth } from "../../src/providers/auth-provider";

export default function Home() {
  const { user, signOut, isDevUser } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/(onboarding)/onboarding");
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";

  return (
    <View style={styles.container}>
      {/* 🔧 Banner de Dev Mode */}
      {isDevUser && (
        <View style={styles.devBanner}>
          <AppText weight="bold" style={styles.devText}>
            🔧 DEV MODE ACTIVO
          </AppText>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText weight="bold" style={styles.title}>
            Hola, {userName}! 👋
          </AppText>
          <AppText style={styles.subtitle}>
            Bienvenido a PuffZero
          </AppText>
        </View>

        {/* Card de Info */}
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

          <View style={styles.infoRow}>
            <AppText style={styles.label}>🎯 Estado:</AppText>
            <AppText weight="medium" style={styles.value}>
              Usuario Activo
            </AppText>
          </View>
        </View>

        {/* Botones de Navegación */}
        <View style={styles.navSection}>
          <AppText weight="bold" style={styles.sectionTitle}>
            Navegación Rápida
          </AppText>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/(app)/profile")}
          >
            <AppText weight="semibold" style={styles.navButtonText}>
              👤 Ver Perfil
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/(app)/progress")}
          >
            <AppText weight="semibold" style={styles.navButtonText}>
              📊 Ver Progreso
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push("/(app)/zuffy")}
          >
            <AppText weight="semibold" style={styles.navButtonText}>
              💬 Hablar con Zuffy
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsSection}>
          {/* Logout */}
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <AppText weight="bold" style={styles.buttonText}>
              🚪 Cerrar Sesión
            </AppText>
          </TouchableOpacity>

          {/* Reset App (solo en dev) */}
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
  
  devBanner: {
    backgroundColor: "#FFD700",
    padding: 12,
    alignItems: "center",
  },
  
  devText: {
    fontSize: 14,
    color: "#000",
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

  navSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 12,
  },

  navButton: {
    backgroundColor: Colors.light.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },

  navButtonText: {
    fontSize: 16,
    color: Colors.light.text,
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
