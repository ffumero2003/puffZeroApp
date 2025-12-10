import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import OnboardingWhiteButton from "../../src/components/onboarding/onboarding-white-button";
import TitleBlock from "../../src/components/onboarding/title-block";
import { useOnboarding } from "../../src/providers/onboarding-provider";
import { layout } from "../../src/styles/layout";

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
    <View style={layout.containerWithLoadingBar}>
      <OnboardingHeader step={10} total={11} />

      {/* 🔵 TitleBlock fuera del Scroll para que NO se desplace */}
      <View style={layout.content}>
        <TitleBlock
          title="¿Por qué querés dejar de vapear?"
          subtitle="Entender tu motivación fortalece tu proceso."
        />
      </View>

      {/* 🟣 Scroll exclusivo para las opciones */}
      <ScrollView
        
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {MOTIVATION_OPTIONS.map((opt) => (
          <OnboardingWhiteButton
            key={opt.id}
            title={opt.title}
            onPress={() => {
              setWhyStopped([opt.id]);
              router.push("/onboarding-worries");
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}


