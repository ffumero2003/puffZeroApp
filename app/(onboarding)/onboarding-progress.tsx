import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";


import ProgressScreen from "../../assets/images/onboarding/onboarding-progress-page.png";

export default function OnboardingProgress() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
      if (hasSeen === "true") {
        setShowLogin(true);
      }
    };

    checkOnboarding();
  }, []);

  return (
    <View style={layout.screenContainer}>

      {/* 🔵 HEADER ARRIBA FIJO */}
      <OnboardingHeader step={1} total={11} />

      {/* 🟣 TODO EL RESTO INICIA DESDE ABAJO */}
      <View style={{ width: "100%", alignItems: "center" }}>
        
        <Image
          source={ProgressScreen}
          style={layout.bigImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={layout.titleCenter}>
          Visualiza fácilmente tu progreso
        </AppText>

        <ContinueButton
          text="Continuar"
          onPress={() => router.push("/onboarding-zuffy")}
          style={layout.bottomButtonContainer}
        />

        {showLogin && <LoginText />}
      </View>

    </View>
  );
}
