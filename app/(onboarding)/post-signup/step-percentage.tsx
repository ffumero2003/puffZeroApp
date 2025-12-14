import AppText from "@/src/components/AppText";
import CheckItem from "@/src/components/onboarding/CheckItem";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";
import { useStepPercentageViewModel } from "@/src/viewmodels/onboarding/useStepPercentageViewModel";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function StepPercentage() {
  const { progress, getStatusText } = useStepPercentageViewModel();
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

  return (
    <View style={layout.screenContainer}>
      <OnboardingHeader showBack={false} showProgress={false} />

      <View style={styles.center}>
        <AppText weight="extrabold" style={styles.percentage}>
          {progress}%
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
