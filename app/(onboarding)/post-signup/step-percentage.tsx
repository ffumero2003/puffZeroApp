import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import AppText from "../../../src/components/app-text";
import CheckItem from "../../../src/components/onboarding/check-item";
import OnboardingHeader from "../../../src/components/onboarding/onboarding-header";
import { Colors } from "../../../src/constants/theme";
import { layout } from "../../../src/styles/layout";

// 🧪 DEV CONTROLS — BORRAR O DESACTIVAR PARA PRODUCCIÓN
const DEV_FREEZE = false;
const DEV_PROGRESS = 45;

const INTERVAL_MS = 60;
const COMPLETE_DELAY = 900;

export default function StepPercentage() {
  const [progress, setProgress] = useState(
    DEV_FREEZE ? DEV_PROGRESS : 0
  );

  const animatedWidth = useRef(new Animated.Value(progress)).current;

  // 🔁 Progreso controlado
  useEffect(() => {
    if (DEV_FREEZE) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.replace("/(onboarding)/post-signup/step-personalized-plan");
          }, COMPLETE_DELAY);
          return 100;
        }
        return prev + 1;
      });
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // 🎞️ Animación de barra
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


export const styles = StyleSheet.create({
  // 📌 Contenedor central
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // 🔢 Porcentaje grande (protagonista)
  percentage: {
    fontSize: 52,
    color: Colors.light.primary,
    marginBottom: 6,
    letterSpacing: -1,
  },

  // 🧠 Título principal
  title: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.light.text,
    marginBottom: 28,
  },

  // 📊 Track de la barra
  progressTrack: {
    width: "100%",
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E5E0FF", // gris claro moderno
    overflow: "hidden",
    marginBottom: 14,
  },

  // 🔵 Fill animado
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
  },

  // 📝 Texto de estado dinámico
  statusText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },

  // ✅ Lista de checks
  checklist: {
    width: "100%",
    paddingHorizontal: 8,
    
  },
});
