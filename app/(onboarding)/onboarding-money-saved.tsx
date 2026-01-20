import { Image, View } from "react-native";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { useOnboardingViewModel } from "@/src/viewmodels/onboarding/useOnboardingViewModel";

import MoneySaved from "@/assets/images/onboarding/onboarding-money-saved.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";


export default function OnboardingMoneySaved() {
  const { showLogin } = useOnboardingViewModel()

   //onboarding money saved
    function goToGraph() {
      router.push(ROUTES.ONBOARDING_GRAPH)
    }
  

  return (
    <ScreenWrapper>
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
            onPress={goToGraph}
            style={layout.bottomButtonContainer}
          />

          {showLogin && <LoginText />}
        </View>
      </View>
    </ScreenWrapper>
  );
}
