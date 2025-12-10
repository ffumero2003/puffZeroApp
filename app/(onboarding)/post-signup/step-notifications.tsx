import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import KeepGoingButton from "../../../src/components/onboarding/keep-going-button";
import OnboardingHeader from "../../../src/components/onboarding/onboarding-header";
import { Colors } from "../../../src/constants/theme";

export default function NotificationsStep() {
  return (
    <View style={styles.container}>
      <OnboardingHeader step={1} total={4} />

      {/* Título */}
      <Text style={styles.title}>Alcanza tus metas con{"\n"}recordatorios</Text>
      <Text style={styles.subtitle}>
        Un pequeño recordatorio puede marcar la diferencia en tu día.
      </Text>

      {/* Mock del sistema */}
      <View style={styles.mockCard}>
        <Text style={styles.appName}>“PuffZero” quiere enviarte notificaciones</Text>
        <Text style={styles.mockDescription}>
          Pueden incluir alertas, recordatorios, sonidos o insignias.{"\n"}
          Podés desactivarlas cuando querás desde Configuración.
        </Text>

        <View style={styles.buttonsRow}>
          <View style={[styles.btnOption, { backgroundColor: "#E7E7E7" }]}>
            <Text style={[styles.btnText, { color: "#000" }]}>Don't Allow</Text>
          </View>

          <View style={[styles.btnOption, { backgroundColor: "#3D7BFF" }]}>
            <Text style={[styles.btnText, { color: "#fff" }]}>Allow</Text>
          </View>
        </View>
      </View>

      <Text style={styles.hand}>👉</Text>

      {/* Caja informativa */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          La gran mayoría de usuarios mantienen mejor su progreso usando recordatorios.
        </Text>
      </View>

      {/* Botón continuar */}
      <View style={styles.buttonContainer}>
        <KeepGoingButton
          text="Continuar"
          onPress={() => router.push("/(onboarding)/post-signup/step2")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 20,
    lineHeight: 32,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 8,
    marginBottom: 30,
  },

  mockCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  appName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },

  mockDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
    lineHeight: 18,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  btnOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  btnText: {
    fontSize: 15,
    fontWeight: "600",
  },

  hand: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 10,
    width: "100%",
  },

  infoBox: {
    backgroundColor: "#EDE7FF",
    padding: 16,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
  },

  infoText: {
    color: "#5A4BA8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },

  buttonContainer: {
    marginTop: "auto",
    paddingBottom: 40,
  },
});
