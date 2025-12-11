import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import ContinueButton from "../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import OnboardingOptionCard from "../../src/components/onboarding/onboarding-option-card";
import TitleBlock from "../../src/components/onboarding/title-block";
import { useOnboarding } from "../../src/providers/onboarding-provider";
import { layout } from "../../src/styles/layout";

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
    <View style={layout.screenContainer}>

      {/* 🔵 HEADER ARRIBA */}
      <OnboardingHeader step={9} total={11} />

      {/* 🟣 CONTENIDO SUPERIOR (NO SCROLL) */}
      <View style={layout.content}>
        <TitleBlock
          title="¿Qué tan rápido querés alcanzar tu meta?"
          subtitle="Escogé el plan que mejor vaya con tu forma de vivir y tu momento actual."
        />
      </View>

      {/* 🟡 SCROLL SOLO PARA LAS OPCIONES */}
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
              onPress={() => setSelected(opt.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 🟢 BOTÓN AL FONDO SIEMPRE */}
      <ContinueButton
        text="Continuar"
        disabled={selected === null}
        onPress={() => {
          setGoalSpeed(selected!);
          console.log("🚀 Velocidad seleccionada:", selected);
          router.push("/onboarding-motivation");
        }}
        style={layout.bottomButtonContainer}
      />

    </View>
  );
}
