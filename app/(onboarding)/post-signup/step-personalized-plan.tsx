// step-personalized-plan.tsx
import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

import CheckIcon from "@/assets/images/onboarding/check-onboarding.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import PuffsPlanChart from "@/src/components/onboarding/PuffPlanChart";
import { ROUTES } from "@/src/constants/routes";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";

import { usePersonalizedPlanViewModel } from "@/src/viewmodels/onboarding/usePersonalizedPlanViewModel";

export default function StepPersonalizedPlan() {
  const { targetDate, puffsChart, status, finishFlow } =
    usePersonalizedPlanViewModel();

  //  useEffect(() => {
  //     if (status === "invalid") {
  //       router.replace(ROUTES.POST_SIGNUP_REVIEW);
  //     }
  //   }, [status]);

  //   if (status === "invalid") return null;

  const handleContinue = () => {
    const ok = finishFlow();
    if (ok) {
      router.push(ROUTES.POST_SIGNUP_FACTS);
    }
  };

  return (
    <View style={layout.screenContainer}>
      <View style={layout.content}>
        <OnboardingHeader
          step={0}
          total={11}
          showBack={false}
          showProgress={false}
        />

        <Image
          source={CheckIcon}
          style={styles.checkImage}
          resizeMode="contain"
        />

        <AppText weight="extrabold" style={layout.titleCenterNoMargin}>
          ¡Felicidades! Tu plan personalizado está listo.
        </AppText>

        <View style={{ marginTop: 24 }}>
          <AppText weight="medium" style={layout.description}>
            Deberías dejarlo para:
          </AppText>

          <AppText weight="extrabold" style={styles.dateText}>
            {targetDate ? `📅 ${targetDate}` : "Calculando…"}
          </AppText>
        </View>

        <View style={{ marginTop: 32 }}>
          <AppText weight="extrabold" style={styles.planText}>
            Tu plan personalizado
          </AppText>

          {puffsChart.length > 0 ? (
            <PuffsPlanChart
              data={puffsChart}
              startLabel={`${puffsChart[0]} puffs/día`}
              endLabel="0"
            />
          ) : (
            <AppText
              style={{
                textAlign: "center",
                opacity: 0.6,
                marginTop: 16,
              }}
            >
              Este plan se basa en las respuestas que ingresaste durante el
              onboarding.
            </AppText>
          )}
        </View>

        <AppText style={{ fontSize: 16, textAlign: "center", marginTop: 5 }}>
          Puff
          <AppText
            weight="extrabold"
            style={{ color: Colors.light.primary }}
          >
            Zero
          </AppText>{" "}
          te acompaña, te motiva y te ayuda a mantenerte constante.
        </AppText>
      </View>

      <ContinueButton text="Continuar" onPress={handleContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  checkImage: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  dateText: {
    color: Colors.light.primary,
    fontSize: 24,
    marginTop: 4,
    textAlign: "center",
  },
  planText: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.6,
  },
});
