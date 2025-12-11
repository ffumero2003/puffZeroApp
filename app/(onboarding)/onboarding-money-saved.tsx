import { router } from "expo-router";
import { Image, View } from "react-native";

import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import MoneySaved from "../../assets/images/onboarding/onboarding-money-saved.png";

export default function OnboardingMoneySaved() {
  return (
    <View style={layout.screenContainer}>

      {/* 🔵 GROUP 1 — Header + Imagen + Título */}
      <View>
        <OnboardingHeader step={3} total={11} />

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Image
            source={MoneySaved}
            style={layout.bigImage}
            resizeMode="contain"
          />

          <AppText weight="bold" style={layout.titleCenter}>
            Cada puff evitado suma a tu ahorro
          </AppText>
        </View>
      </View>

      {/* 🟢 GROUP 2 — Botón + Login */}
      <View style={{ width: "100%" }}>
        <ContinueButton
          text="Continuar"
          onPress={() => router.push("/onboarding-graph")}
          style={layout.bottomButtonContainer}
        />

        <LoginText />
      </View>

    </View>
  );
}
