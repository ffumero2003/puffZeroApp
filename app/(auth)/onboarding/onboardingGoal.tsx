import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ContinueButton from "../../../src/components/onboarding/continueButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import OnboardingOptionCard from "../../../src/components/onboarding/onboardingOptionCard";
import TitleBlock from "../../../src/components/onboarding/titleBlock";
import { Colors } from "../../../src/constants/theme";

const GOAL_OPTIONS = [
  {
    id: "reduce",
    badge: "MONITOREAR Y REDUCIR  📊",
    text: "Quiero controlar y bajar mi consumo",
  },
  {
    id: "quit",
    badge: "DEJAR POR COMPLETO  🔥",
    text: "Quiero eliminar el vape de mi vida",
  },
];

export default function OnboardingGoal() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <OnboardingHeader step={7} total={10} />

      <View style={styles.content}>
        <TitleBlock
          title="¿Cuál es tu meta?"
          subtitle="Tu meta puede ajustarse en cualquier momento durante tu proceso."
        />

        {GOAL_OPTIONS.map((opt) => (
          <OnboardingOptionCard
            key={opt.id}
            id={opt.id}
            title={opt.badge}
            description={opt.text}
            selected={selected === opt.id}
            onPress={() => setSelected(opt.id)}
          />
        ))}
      </View>

     
      <ContinueButton 
        text="Continuar"
        route="/(auth)/onboarding/onboardingSpeedPlan"
        style={{ paddingBottom: 30 }}
        disabled={selected === null}
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

  


  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 40,
  },
});
