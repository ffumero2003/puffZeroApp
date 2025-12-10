import { router } from "expo-router";
import { Image, View } from "react-native";
import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import ProgressScreen from "../../assets/images/onboarding/onboarding-progress-page.png";

export default function OnboardingProgress() {
  return (
    <>
      <View style={layout.headerContainer}>
        <OnboardingHeader  step={1} total={11}/>
      </View>
      <View style={layout.container}>
        
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
        />


        <LoginText />
      </View>
    </>
  );
}

