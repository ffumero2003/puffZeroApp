import { router } from "expo-router";
import { Image, View } from "react-native";
import AppText from "../../src/components/app-text";
import KeepGoingButton from "../../src/components/onboarding/keep-going-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import Graph from "../../assets/images/onboarding/onboarding-graph.png";

export default function OnboardingGraph() {
  return (
    <>
      <View style={layout.headerContainer}>
        <OnboardingHeader  step={4} total={11}/>
      </View>
      <View style={layout.container}>
        
        <Image
          source={Graph}
          style={layout.bigImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={layout.titleCenter}>
          Visualiza tu progreso día a día
        </AppText>

        <KeepGoingButton 
        text="Continuar"
        onPress={() => router.push("/onboarding-puffs")}
        />

        <LoginText />

      </View>
    </>
  );
}

