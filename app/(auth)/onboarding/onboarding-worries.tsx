import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import KeepGoingButton from "../../../src/components/onboarding/keep-going-button";
import OnboardingMultiSelectButton from "../../../src/components/onboarding/multi-select-button";
import OnboardingHeader from "../../../src/components/onboarding/onboarding-header";
import TitleBlock from "../../../src/components/onboarding/title-block";
import { Colors } from "../../../src/constants/theme";
import { useOnboarding } from "../../../src/providers/onboarding-provider";

const CONCERNS = [
  { id: "ansiedad", title: "Ansiedad 🧊" },
  { id: "abstinencia", title: "Síndrome de Abstinencia 🫠"},
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
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader step={11} total={11} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TitleBlock
          title="¿Qué te preocupa al dejar el vape?"
          subtitle="Conocer tus preocupaciones nos ayuda a darte un mejor apoyo."
        />

        {CONCERNS.map((item) => (
          <OnboardingMultiSelectButton
            key={item.id}
            title={item.title}
            selected={selected.includes(item.id)}
            onPress={() => toggleSelect(item.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <KeepGoingButton
          text="Continuar"
          disabled={selected.length === 0}
          onPress={() => {
            setWorries(selected);   // 💾 Guardamos el array completo
            console.log("Preocupaciones guardadas:", selected);
            router.push("/(auth)/registrarse");
          }}
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
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 40,
  },
});
