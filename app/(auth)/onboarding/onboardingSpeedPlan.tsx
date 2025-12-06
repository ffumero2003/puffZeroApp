import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import ContinueButton from "../../../src/components/onboarding/continueButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import OnboardingOptionCard from "../../../src/components/onboarding/onboardingOptionCard";
import TitleBlock from "../../../src/components/onboarding/titleBlock";
import { Colors } from "../../../src/constants/theme";
import { useOnboarding } from "../../../src/providers/onboardingProvider";
const OPTIONS = [
  {
    id: "14",
    title: "14 DÍAS — SPRINT RÁPIDO  ⚡",
    description: "Ideal para quienes vapearon poco y buscan un cambio rápido.",
  },
  {
    id: "21",
    title: "21 DÍAS — NUEVO HÁBITO  💪",
    description: "Ideal para empezar a cambiar tu relación con el vape paso a paso.",
  },
  {
    id: "30",
    title: "30 DÍAS — REINICIO COMPLETO  ✨",
    description: "Ideal para quienes vapearon poco y buscan un cambio rápido.",
  },
  {
    id: "60",
    title: "2 MESES — CAMINO ESTABLE  🚀",
    description: "Ideal para quienes vapearon poco y buscan un cambio rápido.",
  },
  {
    id: "90",
    title: "3 MESES — CAMBIO COMPLETO  ♻️",
    description: "Un plan más tranquilo para una transición duradera.",
  },
];

export default function OnboardingSpeedPlan() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setGoalSpeed } = useOnboarding();


  return (
    <View style={styles.container}>
      <OnboardingHeader step={8} total={10} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TitleBlock
          title="¿Qué tan rápido querés alcanzar tu meta?"
          subtitle="Escogé el plan que mejor vaya con tu forma de vivir y tu momento actual."
        />

        {OPTIONS.map((opt) => (
          <OnboardingOptionCard
            key={opt.id}
            id={opt.id}
            title={opt.title}
            description={opt.description}
            selected={selected === opt.id}
            onPress={() => setSelected(opt.id)}
          />
        ))}
      </ScrollView>

      <ContinueButton
        text="Continuar"
        disabled={selected === null}
        onPress={() => {
          setGoalSpeed(selected!);
          console.log("🚀 Velocidad seleccionada:", selected);
          router.push("/(auth)/onboarding/onboardingMotivation");
        }}
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
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 40,
  },
});
