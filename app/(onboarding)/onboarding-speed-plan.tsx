import { useState } from "react";
import { ScrollView, View } from "react-native";

import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import OnboardingOptionCard from "@/src/components/onboarding/OnboardingOptionCard";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useSpeedPlanViewModel } from "@/src/viewmodels/onboarding/useSpeedPlanViewModel";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
const OPTIONS = [
  {
    id: "14",
    title: "14 DÍAS — SPRINT RÁPIDO  ⚡",
    description: "Ideal para quienes vapearon poco y buscan un cambio rápido.",
  },
  {
    id: "21",
    title: "21 DÍAS — NUEVO HÁBITO  💪",
    description:
      "Ideal para empezar a cambiar tu relación con el vape paso a paso.",
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
  const colors = useThemeColors();
  const [selected, setSelected] = useState<string | null>(null);
  const { submitSpeed } = useSpeedPlanViewModel();

  const handleContinue = (speed: string) => {
    const ok = submitSpeed(speed);
    if (ok) {
      router.push(ROUTES.ONBOARDING_MOTIVATION);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader step={9} total={11} />

        <View style={layout.content}>
          <TitleBlock
            title="¿Qué tan rápido querés alcanzar tu meta?"
            subtitle="Escogé el plan que mejor vaya con tu forma de vivir y tu momento actual."
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {OPTIONS.map((opt) => (
              <OnboardingOptionCard
                key={opt.id}
                id={opt.id}
                title={opt.title}
                description={opt.description}
                selected={selected === opt.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelected(opt.id);
                }}
              />
            ))}
          </ScrollView>
        </View>

        <ContinueButton
          text="Continuar"
          disabled={selected === null}
          onPress={() => handleContinue(selected!)}
          style={layout.bottomButtonContainer}
        />
      </View>
    </ScreenWrapper>
  );
}
