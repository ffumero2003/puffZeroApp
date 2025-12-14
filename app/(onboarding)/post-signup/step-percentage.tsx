import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import AppText from "../../../src/components/app-text";
import CheckItem from "../../../src/components/onboarding/check-item";
import OnboardingHeader from "../../../src/components/onboarding/onboarding-header";
import { Colors } from "../../../src/constants/theme";
import { layout } from "../../../src/styles/layout";

const INTERVAL_MS = 60;
const COMPLETE_DELAY = 900;

export default function StepPercentage() {
  const [progress, setProgress] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          timeoutRef.current = setTimeout(() => {
            router.push("/(onboarding)/post-signup/step-personalized-plan");
          }, COMPLETE_DELAY);

          return 100;
        }
        return prev + 1;
      });
    }, INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

  const getStatusText = () => {
    if (progress < 20) return "Analizando tu perfil…";
    if (progress < 45) return "Ajustando tus recomendaciones…";
    if (progress < 75) return "Construyendo tu plan diario…";
    return "Todo listo 🚀";
  };

  return (
    <View style={layout.screenContainer}>
      <OnboardingHeader showBack={false} showProgress={false} />

      <View style={styles.center}>
        <AppText weight="extrabold" style={styles.percentage}>
          {progress}%
        </AppText>

        <AppText weight="bold" style={styles.title}>
          Estamos preparando todo para vos
        </AppText>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>

        <AppText style={styles.statusText}>{getStatusText()}</AppText>

        <View style={styles.checklist}>
          <CheckItem text="Mejorar tu salud" active={progress >= 20} />
          <CheckItem text="Reducir puffs" active={progress >= 35} />
          <CheckItem text="Control de ansiedad" active={progress >= 55} />
          <CheckItem text="Reducción de nicotina" active={progress >= 75} />
          <CheckItem text="Manejo del estrés" active={progress >= 90} />
        </View>
      </View>
    </View>
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
    color: Colors.light.primary,
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
    backgroundColor: "#E5E0FF",
    overflow: "hidden",
    marginBottom: 14,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  checklist: {
    width: "100%",
    paddingHorizontal: 8,
  },
});
