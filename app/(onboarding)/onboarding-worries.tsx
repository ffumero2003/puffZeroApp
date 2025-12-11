import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import ContinueButton from "../../src/components/onboarding/continue-button";
import MultiSelectButton from "../../src/components/onboarding/multi-select-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import TitleBlock from "../../src/components/onboarding/title-block";
import { useOnboarding } from "../../src/providers/onboarding-provider";
import { layout } from "../../src/styles/layout";

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
  const { setWorries } = useOnboarding();

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={layout.screenContainer}>

      {/* 🔵 HEADER FIJO ARRIBA */}
      <OnboardingHeader step={11} total={11} />

      {/* 🟣 TITLEBLOCK (NO SCROLL) */}
      <View style={layout.content}>
        <TitleBlock
          title="¿Qué te preocupa al dejar el vape?"
          subtitle="Conocer tus preocupaciones nos ayuda a darte un mejor apoyo."
        />
      </View>

      {/* 🟡 SCROLL SOLO PARA LAS OPCIONES */}
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

      {/* 🟢 BOTÓN SIEMPRE AL FONDO */}
      <ContinueButton
        text="Continuar"
        disabled={selected.length === 0}
        onPress={() => {
          setWorries(selected);
          console.log("Preocupaciones guardadas:", selected);
          router.push("/(auth)/registrarse");
        }}
        style={layout.bottomButtonContainer}
      />

    </View>
  );
}
