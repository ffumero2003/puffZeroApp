import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import FactItem from "@/src/components/onboarding/FactItem";
import HowToFacts from "@/src/components/onboarding/HowToFacts";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { FACTS, HOW_TO_FACTS } from "@/src/lib/onboarding/facts.library";
import { layout } from "@/src/styles/layout";

export default function StepFacts() {

  const goPay = () => {
    router.push(ROUTES.POST_SIGNUP_PAYWALL);
  };
  return (
    <ScreenWrapper>
      <View style={layout.screenContainer}>
        <View style={layout.content}>
          <OnboardingHeader showBack={false} showProgress={false} />

          {/* FACTS */}
          {FACTS.map((fact) => (
            <FactItem
              key={fact.key}
              icon={fact.icon}
              value={fact.value}
              label={fact.label}
            />
          ))}

          {/* HOW TO */}
          <View style={styles.section}>
            <AppText weight="extrabold" style={styles.sectionTitle}>
              Cómo alcanzar tus metas
            </AppText>

            {HOW_TO_FACTS.map((item) => (
              <HowToFacts
                key={item.key}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </View>
        </View>

        <ContinueButton
          text="¡Listo para empezar!"
          onPress={goPay}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 26,
  },
});
