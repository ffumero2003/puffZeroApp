import AppText from "@/src/components/AppText";
import CheckItem from "@/src/components/onboarding/CheckItem";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useStepPercentageViewModel } from "@/src/viewmodels/onboarding/useStepPercentageViewModel";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import ScreenWrapper from "@/src/components/system/ScreenWrapper";

export default function StepPercentage() {
  const colors = useThemeColors();
  const { progress, getStatusText, completed } = useStepPercentageViewModel();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 30,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (completed && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push(ROUTES.POST_SIGNUP_PLAN);
    }
  }, [completed]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!completed && !hasNavigated.current) {
        hasNavigated.current = true;
        router.push(ROUTES.POST_SIGNUP_PLAN);
      }
    }, 15000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader showBack={false} showProgress={false} />

        <View style={styles.center}>
          <AppText
            weight="extrabold"
            style={[styles.percentage, { color: colors.primary }]}
          >
            {progress}%
          </AppText>

          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: colors.primary },
              ]}
            />
          </View>

          <AppText style={[styles.statusText, { color: colors.textMuted }]}>
            {getStatusText()}
          </AppText>

          <View style={styles.checklist}>
            <CheckItem text="Mejorar tu salud" active={progress >= 20} />
            <CheckItem text="Reducir puffs" active={progress >= 35} />
            <CheckItem text="Control de ansiedad" active={progress >= 55} />
            <CheckItem text="Reducción de nicotina" active={progress >= 75} />
            <CheckItem text="Manejo del estrés" active={progress >= 90} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  percentage: {
    fontSize: 52,
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 28,
  },
  progressTrack: {
    width: "100%",
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: "100%",
  },
  statusText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  checklist: {
    width: "100%", // todos iguales
    flexDirection: "column",
    alignItems: "center",
  },
});
