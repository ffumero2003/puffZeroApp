import ContinueButton from "@/src/components/onboarding/continue-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

import AppText from "../../src/components/app-text";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import ZuffyImage from "../../assets/images/onboarding/onboarding-zuffy-page.png";

export default function OnboardingZuffy() {
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
      <OnboardingHeader step={2} total={11} />

      <View style={{ width: "100%", alignItems: "center" }}>
        <Image
          source={ZuffyImage}
          style={layout.bigImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={layout.titleCenter}>
          Zuffy, tu acompañante en el proceso
        </AppText>

        <ContinueButton
          text="Continuar"
          onPress={() => router.push("/onboarding-money-saved")}
          style={layout.bottomButtonContainer}
        />

        {showLogin && <LoginText />}
      </View>
    </View>
  );
}
