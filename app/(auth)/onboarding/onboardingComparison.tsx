import { Image, StyleSheet, View } from "react-native";

import AppText from "../../../src/components/appText";
import ContinueButton from "../../../src/components/onboarding/continueButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import TitleBlock from "../../../src/components/onboarding/titleBlock";
import { Colors } from "../../../src/constants/theme";

import ComparisonImage from "../../../assets/images/onboarding/conPuffZero.png";

export default function OnboardingComparison() {
  return (
    <View style={styles.container}>
      <OnboardingHeader step={6} total={10} />

      <View style={styles.content}>
        <TitleBlock
          title="Avanzá hacia una vida sin vape el doble de rápido"
          subtitle="Tu transición al dejar el vape"
        />

        {/* Imagen completa */}
        <Image
          source={ComparisonImage}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Texto inferior */}
        <AppText style={styles.description}>
          Puff
          <AppText
            weight="extrabold"
            style={{ color: Colors.light.primary }}
          >
            Zero
          </AppText>{" "}
          te acompaña, te motiva y te ayuda a mantenerte constante.
        </AppText>

        
      </View>
      <ContinueButton
          text="Continuar"
          route="/(auth)/onboarding/onboardingGoal"
          style={{ paddingBottom: 30 }}
        />
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
  content: {
    flex: 1,
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: 220, // ajustá si es más alta o más baja
    marginVertical: 20,
  },
  description: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    marginTop: 20,
    marginBottom: 60,
    textAlign: "center",
  },
});
