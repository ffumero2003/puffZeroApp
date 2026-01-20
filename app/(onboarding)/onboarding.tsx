import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { Image, View } from "react-native";

import HomePage from "@/assets/images/onboarding/onboarding-home-page.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useOnboardingViewModel } from "@/src/viewmodels/onboarding/useOnboardingViewModel";
import { router } from "expo-router";

export default function Onboarding() {
  const { showLogin } = useOnboardingViewModel();

  //onboarding
  function goToProgress() {
    router.push(ROUTES.ONBOARDING_PROGRESS);
  }

  return (
    <ScreenWrapper>
      <View style={layout.screenContainer}>
        <OnboardingHeader
          step={0}
          total={11}
          showBack={false}
          showProgress={false}
        />

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
            onPress={goToProgress}
            style={layout.bottomButtonContainer}
          />

          {showLogin && <LoginText />}
          <LoginText />
        </View>
      </View>
    </ScreenWrapper>
  );
}
