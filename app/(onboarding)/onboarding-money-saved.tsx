import { router } from "expo-router";
import { Image, View } from "react-native";
import AppText from "../../src/components/app-text";
import KeepGoingButton from "../../src/components/onboarding/keep-going-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { layout } from "../../src/styles/layout";

import MoneySaved from "../../assets/images/onboarding/onboarding-money-saved.png";

export default function OnboardingMoneySaved() {
  return (
    <>
      <View style={layout.headerContainer}>
        <OnboardingHeader  step={3} total={11}/>
      </View>
      <View style={layout.container}>
        
        <Image
          source={MoneySaved}
          style={layout.bigImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={layout.titleCenter}>
          Cada puff evitado suma a tu ahorro
        </AppText>

        <KeepGoingButton 
        text="Continuar"
        onPress={() => router.push("/onboarding-graph")}
        />

        <LoginText />

      </View>
    </>
  );
}

