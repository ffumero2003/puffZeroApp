import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import ContinueButton from "../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import OnboardingOptionCard from "../../src/components/onboarding/onboarding-option-card";
import TitleBlock from "../../src/components/onboarding/title-block";
import { useOnboarding } from "../../src/providers/onboarding-provider";
import { layout } from "../../src/styles/layout";

const GOAL_OPTIONS = [
  {
    id: "reduce",
    badge: "MONITOREAR Y REDUCIR  📊",
    text: "Quiero medir mi consumo diario y reducirlo de forma constante",
  },
  {
    id: "quit",
    badge: "DEJAR POR COMPLETO  🔥",
    text: "Quiero dejar el vape definitivamente y no volver a depender de él",
  },

];

export default function OnboardingGoal() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setGoal } = useOnboarding();

  return (
    <View style={layout.screenContainer}>
      
      {/* GROUP 1 — everything above the button */}
      <View>
        <OnboardingHeader step={8} total={11} />

        <View style={layout.content}>
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
      </View>

      {/* GROUP 2 — button at bottom */}
      <ContinueButton
        text="Continuar"
        disabled={selected === null}
        onPress={() => {
          setGoal(selected!);
          router.push("/onboarding-speed-plan");
        }}
        style={layout.bottomButtonSpacing}
      />

    </View>
  );
}

