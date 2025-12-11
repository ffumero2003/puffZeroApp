import { router } from "expo-router";
import { Image, View } from "react-native";

import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import Graph from "../../assets/images/onboarding/onboarding-graph.png";

export default function OnboardingGraph() {
  return (
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
          onPress={() => router.push("/onboarding-puffs")}
          style={layout.bottomButtonContainer}
        />

        <LoginText />
      </View>

    </View>
  );
}
