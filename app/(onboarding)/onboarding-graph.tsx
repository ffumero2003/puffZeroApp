import { Image, View } from "react-native";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";

import Graph from "@/assets/images/onboarding/onboarding-graph.png";

import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";

export default function OnboardingGraph() {
  //onboarding money saved
  function goToPuffCount() {
    router.push(ROUTES.ONBOARDING_PUFFS);
  }

  return (
    <ScreenWrapper>
      <View style={layout.screenContainer}>
        {/* 🔵 GROUP 1 — contenido superior */}
        <View>
          <OnboardingHeader step={4} total={11} />

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Image
              source={Graph}
              style={layout.bigImage}
              resizeMode="contain"
            />

            <AppText weight="bold" style={layout.titleCenter}>
              Visualiza tu progreso día a día
            </AppText>
          </View>
        </View>

        {/* 🟢 GROUP 2 — botón + login */}
        <View style={{ width: "100%" }}>
          <ContinueButton
            text="Continuar"
            onPress={goToPuffCount}
            style={layout.bottomButtonContainer}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
