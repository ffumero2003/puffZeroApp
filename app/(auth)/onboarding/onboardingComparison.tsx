import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../../src/components/appText";
import KeepGoingButton from "../../../src/components/onboarding/keepGoingButton";
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

        {/* IMAGEN COMPLETA */}
        <Image
          source={ComparisonImage}
          style={styles.image}
          resizeMode="contain"
        />

        {/* TEXTO INFERIOR */}
        <AppText style={styles.description}>
          PuffZero te acompaña, te motiva y te ayuda a mantenerte constante.
        </AppText>

        <KeepGoingButton
          text="Continuar"
          onPress={() => router.push("/(auth)/onboarding/onboardingGoal")}
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
  content: {
    flex: 1,
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: 220,  // ajustá si es más alta o más baja
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
