import { useState } from "react";
import { View } from "react-native";

import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import OnboardingOptionCard from "@/src/components/onboarding/OnboardingOptionCard";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useGoalViewModel } from "@/src/viewmodels/onboarding/useGoalViewModel";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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
  const colors = useThemeColors();
  const [selected, setSelected] = useState<string | null>(null);
  const { submitGoal } = useGoalViewModel();

  const handleContinue = () => {
    if (!selected) return;

    const ok = submitGoal(selected);

    if (ok) {
      router.push("/onboarding-speed-plan");
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <View style={{ flex: 1 }}>
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelected(opt.id);
                }}
              />
            ))}
          </View>
        </View>

        <ContinueButton
          text="Continuar"
          disabled={!selected}
          onPress={handleContinue}
          style={layout.bottomButtonContainer}
        />
      </View>
    </ScreenWrapper>
  );
}
