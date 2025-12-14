import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import AppText from "../../../src/components/app-text";
import ContinueButton from "../../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../../src/components/onboarding/onboarding-header";
import { Colors } from "../../../src/constants/theme";
import { layout } from "../../../src/styles/layout";

import { useOnboarding } from "../../../src/providers/onboarding-provider";

import CheckIcon from "../../../assets/images/onboarding/check-onboarding.png";

/* -------------------------------
   Utils
--------------------------------*/

function getTargetDate(createdAt: string, goalSpeed: number): Date {
  const start = new Date(createdAt);
  const target = new Date(start);
  target.setDate(start.getDate() + goalSpeed);
  return target;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* -------------------------------
   Screen
--------------------------------*/

export default function StepPersonalizedPlan() {
  const {
    goal_speed,
    profile_created_at,
    resetAll,
  } = useOnboarding();

  const [targetDate, setTargetDate] = useState<string | null>(null);

  useEffect(() => {
    // 🛑 GUARD DURO — si algo falta, el flujo está roto
    if (!goal_speed || !profile_created_at) {
      console.warn("❌ Datos incompletos para plan personalizado");
      router.replace("/(onboarding)/post-signup/step-review");
      return;
    }

    const days = Number(goal_speed);
    if (Number.isNaN(days)) {
      console.warn("❌ goal_speed inválido:", goal_speed);
      router.replace("/(onboarding)/post-signup/step-review");
      return;
    }

    const date = getTargetDate(profile_created_at, days);
    setTargetDate(formatDate(date));
  }, [goal_speed, profile_created_at]);

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

          <AppText
            weight="extrabold"
            style={styles.dateText}
          >
            {targetDate ? `📅 ${targetDate}` : "Calculando…"}
          </AppText>
        </View>
      </View>

      <ContinueButton
        text="Continuar"
        onPress={() => {
          // ✅ RESET SOLO AL FINAL REAL
          resetAll();
          router.push("/(onboarding)/post-signup/step4");
        }}
      />
    </View>
  );
}

/* -------------------------------
   Styles
--------------------------------*/

const styles = StyleSheet.create({
  checkImage: {
    width: "100%",
    height: 150,
    marginBottom: 30,
  },
  dateText: {
    color: Colors.light.primary,
    fontSize: 24,
    marginTop: 4,
    textAlign: "center"
  }
});
