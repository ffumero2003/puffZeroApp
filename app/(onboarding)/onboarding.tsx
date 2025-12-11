import ContinueButton from "@/src/components/onboarding/continue-button";
import { router } from "expo-router";
import { Image, View } from "react-native";

import AppText from "../../src/components/app-text";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import HomePage from "../../assets/images/onboarding/onboarding-home-page.png";

export default function Onboarding() {
  return (
    <View style={layout.screenContainer}>

      {/* 🔵 HEADER FIJO ARRIBA */}
      <OnboardingHeader step={0} total={11} showBack={false} showProgress={false} />

      {/* 🟣 TODO EL CONTENIDO INICIA DESDE ABAJO */}
      <View style={{ width: "100%", alignItems: "center" }}>
        
        <Image
          source={HomePage}
          style={layout.bigImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={layout.titleCenter}>
            Lleva tu consumo al día, sin complicaciones        
        </AppText>

        <ContinueButton
          text="Continuar"
          onPress={() => router.push("/onboarding-progress")}
          style={layout.bottomButtonContainer}
        />

        <LoginText />
      </View>

    </View>
  );
}
