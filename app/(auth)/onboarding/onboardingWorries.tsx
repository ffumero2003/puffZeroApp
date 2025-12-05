import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import KeepGoingButton from "../../../src/components/onboarding/keepGoingButton";
import OnboardingMultiSelectButton from "../../../src/components/onboarding/multiSelectButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import TitleBlock from "../../../src/components/onboarding/titleBlock";
import { Colors } from "../../../src/constants/theme";

const CONCERNS = [
  { id: "ansiedad", title: "Ansiedad y síndrome de abstinencia 🧊" },
  { id: "presion", title: "Presión Social 🧍🏻‍♂️" },
  { id: "estres", title: "Manejo de estrés 😟" },
  { id: "miedo", title: "Miedo a fallar 🎢" },
  { id: "habitos", title: "Hábitos y rutinas diarias 🐒" },
  { id: "tiempo", title: "Tiempo y paciencia 🕒" },
  { id: "productividad", title: "Productividad / concentración 🧳" },
];

export default function OnboardingWorries() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // remove
        : [...prev, id] // add
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader step={10} total={10} />

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
          onPress={() => router.push("/(auth)/registrarse")}
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
