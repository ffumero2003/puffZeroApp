import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import OnboardingWhiteButton from "../../src/components/onboarding/onboarding-white-button";
import TitleBlock from "../../src/components/onboarding/title-block";
import { Colors } from "../../src/constants/theme";
import { useOnboarding } from "../../src/providers/onboarding-provider";

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
  const { setWhyStopped } = useOnboarding();

  return (
    <View style={styles.container}>
      <OnboardingHeader step={10} total={11} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TitleBlock
          title="¿Por qué querés dejar de vapear?"
          subtitle="Entender tu motivación fortalece tu proceso."
        />

        {MOTIVATION_OPTIONS.map((opt) => (
          <OnboardingWhiteButton
            key={opt.id}
            title={opt.title}
            onPress={() => {
              setWhyStopped([opt.id]);     // 💾 Guardar en el contexto
              console.log("Motivación seleccionada:", opt.id);
              router.push("/onboarding-worries");
            }}
          />
        ))}
      </ScrollView>
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
});
