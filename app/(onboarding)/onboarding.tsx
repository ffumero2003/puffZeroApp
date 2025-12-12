import ContinueButton from "@/src/components/onboarding/continue-button";
import { router } from "expo-router";
import { Image, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import AppText from "../../src/components/app-text";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import HomePage from "../../assets/images/onboarding/onboarding-home-page.png";

export default function Onboarding() {
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

  const handleContinue = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.push("/onboarding-progress");
  };


  return (
    <View style={layout.screenContainer}>
      <OnboardingHeader step={0} total={11} showBack={false} showProgress={false} />

      <View style={{ width: "100%", alignItems: "center" }}>
        <Image source={HomePage} style={layout.bigImage} resizeMode="contain" />

        <AppText weight="bold" style={layout.titleCenter}>
          Lleva tu consumo al día, sin complicaciones
        </AppText>

        <ContinueButton
          text="Continuar"
          onPress={handleContinue}
          style={layout.bottomButtonContainer}
        />

        {showLogin && <LoginText />}
      </View>
    </View>
  );
}
