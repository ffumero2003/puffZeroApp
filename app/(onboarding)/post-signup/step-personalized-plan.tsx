// step-personalized-plan.tsx
import { router } from "expo-router";
import { Dimensions, Image, StyleSheet, View } from "react-native";

import CheckIconDark from "@/assets/images/onboarding/dark/checked-dark.png";
import CheckIconLight from "@/assets/images/onboarding/light/checked-light.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import PuffsPlanChart from "@/src/components/onboarding/PuffPlanChart";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useTheme } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useEffect } from "react";

import { usePersonalizedPlanViewModel } from "@/src/viewmodels/onboarding/usePersonalizedPlanViewModel";

export default function StepPersonalizedPlan() {
  const { colors, activeTheme } = useTheme();
  const { targetDate, puffsChart, status, finishFlow } =
    usePersonalizedPlanViewModel();

  const screenWidth = Dimensions.get("window").width;

  const checkIcon = activeTheme === "light" ? CheckIconLight : CheckIconDark;

  useEffect(() => {
    if (status === "invalid") {
      router.replace(ROUTES.POST_SIGNUP_REVIEW);
    }
  }, [status]);

  if (status === "invalid") return null;

  const handleContinue = () => {
    const ok = finishFlow();
    if (ok) {
      router.push(ROUTES.POST_SIGNUP_FACTS);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <View style={[layout.content, { flex: 1 }]}>
          <OnboardingHeader
            step={0}
            total={11}
            showBack={false}
            showProgress={false}
          />

          <Image
            source={checkIcon}
            style={{
              width: screenWidth * 0.28,
              height: screenWidth * 0.28,
              alignSelf: "center",
              marginBottom: 20,
            }}
            resizeMode="contain"
          />

          <AppText
            weight="extrabold"
            style={[layout.titleCenterPersonalizedPlan, { color: colors.text }]}
          >
            ¡Felicidades! Tu plan personalizado está listo.
          </AppText>

          <View style={{ marginTop: 24 }}>
            <AppText
              weight="medium"
              style={[layout.description, { color: colors.text }]}
            >
              Deberías dejarlo para:
            </AppText>

            <AppText
              weight="extrabold"
              style={[styles.dateText, { color: colors.primary }]}
            >
              {targetDate ? `📅 ${targetDate}` : "Calculando…"}
            </AppText>
          </View>

          <View style={{ marginTop: 32 }}>
            <AppText
              weight="extrabold"
              style={[styles.planText, { color: colors.text }]}
            >
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
            <AppText weight="extrabold" style={{ color: colors.primary }}>
              Zero
            </AppText>{" "}
            te acompaña, te motiva y te ayuda a mantenerte constante.
          </AppText>
        </View>

        <ContinueButton text="Continuar" onPress={handleContinue} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // Remove this block:
  checkImage: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },

  dateText: {
    fontSize: 24,
    marginTop: 4,
    textAlign: "center",
  },
  planText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
