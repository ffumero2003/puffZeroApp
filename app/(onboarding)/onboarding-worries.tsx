import { useState } from "react";
import { ScrollView, View } from "react-native";

import ContinueButton from "@/src/components/onboarding/ContinueButton";
import MultiSelectButton from "@/src/components/onboarding/MultiSelectButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import { ROUTES } from "@/src/constants/routes";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";

import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useWorriesViewModel } from "@/src/viewmodels/onboarding/useWorriesViewModel";

const CONCERNS = [
  { id: "ansiedad", title: "Ansiedad 🧊" },
  { id: "abstinencia", title: "Síndrome de Abstinencia 🫠" },
  { id: "presion", title: "Presión Social 🧍🏻‍♂️" },
  { id: "estres", title: "Manejo de estrés 😟" },
  { id: "miedo", title: "Miedo a fallar 🎢" },
  { id: "habitos", title: "Hábitos y rutinas diarias 🐒" },
  { id: "tiempo", title: "Tiempo y paciencia 🕒" },
  { id: "productividad", title: "Productividad 🧳" },
];

export default function OnboardingWorries() {
  const [selected, setSelected] = useState<string[]>([]);
  const { submitWorries } = useWorriesViewModel();

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleContinue = (worries: string[]) => {
    const ok = submitWorries(worries);
    if (ok) {
      router.push(ROUTES.REGISTER);
    }
  };

  return (
    <ScreenWrapper>
      <View style={layout.screenContainer}>
        <OnboardingHeader step={11} total={11} />

        <View style={layout.content}>
          <TitleBlock
            title="¿Qué te preocupa al dejar el vape?"
            subtitle="Conocer tus preocupaciones nos ayuda a darte un mejor apoyo."
          />
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {CONCERNS.map(item => (
              <MultiSelectButton
                key={item.id}
                title={item.title}
                selected={selected.includes(item.id)}
                onPress={() => toggleSelect(item.id)}
              />
            ))}
          </ScrollView>
        </View>

        <ContinueButton
          text="Continuar"
          disabled={selected.length === 0}
          onPress={() => handleContinue(selected)}
          style={layout.bottomButtonContainer}
        />
      </View>
    </ScreenWrapper>
  );
}
