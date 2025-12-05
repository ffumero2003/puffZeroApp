import { StyleSheet, View } from "react-native";
import AppText from "../src/components/appText";
import OnboardingHeader from "../src/components/onboarding/onboardingHeader";
import { Colors } from "../src/constants/theme";

export default function LoginSuccess() {
  return (
    <View style={styles.container}>
      <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />
      
      <AppText weight="bold" style={styles.title}>
        ¡Login exitoso! 🎉
      </AppText>

      <AppText style={styles.subtitle}>
        Ya podés continuar dentro de PuffZero.
      </AppText>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textMuted,
    textAlign: "center",
    marginBottom: 30,
  },
});
