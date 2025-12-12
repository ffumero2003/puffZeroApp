import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

import AppText from "../../../src/components/app-text";
import ContinueButton from "../../../src/components/onboarding/continue-button";
import { Colors } from "../../../src/constants/theme";
import { layout } from "../../../src/styles/layout";

import { useAuth } from "../../../src/providers/auth-provider";

import CheckIcon from "../../../assets/images/onboarding/check-onboarding.png";
import { supabase } from "../../../src/lib/supabase";

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


export default function StepPersonalizedPlan() {
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (initializing || !user) return;

    const loadProfileAndCalculate = async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("created_at, goal_speed")
        .eq("user_id", user.id)
        .single();

      if (error || !profile?.created_at || !profile.goal_speed) {
        console.log("❌ Profile incompleto", error);
        return;
      }

      const days = Number(profile.goal_speed);
      if (Number.isNaN(days)) return;

      const date = getTargetDate(profile.created_at, days);
      setTargetDate(formatDate(date));
    };

    loadProfileAndCalculate();
  }, [initializing, user]);


  return (
    <View style={layout.screenContainer}>
      <View style={layout.content}>
        <Image
          source={CheckIcon}
          style={layout.headerImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={layout.titleCenterNoMargin}>
          ¡Felicidades! Tu plan personalizado está listo.
        </AppText>

        <View style={{ marginTop: 24 }}>
          <AppText weight="medium" style={layout.description}>
            Deberías dejarlo para:
          </AppText>

          <AppText
            weight="extrabold"
            style={{
              color: Colors.light.primary,
              fontSize: 18,
              marginTop: 4,
            }}
          >
            {targetDate ? `📅 ${targetDate}` : "Calculando…"}
          </AppText>
        </View>
      </View>

      <ContinueButton
        text="Continuar"
        onPress={() => {
          router.push("/(onboarding)/post-signup/step4");
        }}
      />
    </View>
  );
}
