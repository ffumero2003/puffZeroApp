// onboarding-motivation.tsx
import { router } from "expo-router";
import { ScrollView, View } from "react-native";

import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import OnboardingWhiteButton from "@/src/components/onboarding/OnboardingWhiteButton";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import { layout } from "@/src/styles/layout";

import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useMotivationViewModel } from "@/src/viewmodels/onboarding/useMotivationViewModel";

const MOTIVATION_OPTIONS = [
  { id: "salud", title: "Salud ❤️" },
  { id: "finanzas", title: "Libertad Financiera 💰" },
  { id: "independencia", title: "Independencia 🔒" },
  { id: "social", title: "Razones Sociales 🧑‍🤝‍🧑" },
  { id: "crecimiento", title: "Crecimiento Personal 🌱" },
  { id: "ansiedad", title: "Menos Ansiedad 😔" },
  { id: "fitness", title: "Mejor condición física 🏃‍♂️" },
];

export default function OnboardingMotivation() {
  const { submitMotivation } = useMotivationViewModel();

  const handleSelect = (id: string) => {
    const ok = submitMotivation(id);
    if (ok) {
      router.push("/onboarding-worries");
    }
  };

  return (
    <ScreenWrapper>
      <View style={layout.containerWithLoadingBar}>
        <OnboardingHeader step={10} total={11} />

        <View style={layout.content}>
          <TitleBlock
            title="¿Por qué querés dejar de vapear?"
            subtitle="Entender tu motivación fortalece tu proceso."
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {MOTIVATION_OPTIONS.map((opt) => (
            <OnboardingWhiteButton
              key={opt.id}
              title={opt.title}
              onPress={() => handleSelect(opt.id)}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
