import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { Image, View } from "react-native";

import ZuffyImage from "@/assets/images/onboarding/onboarding-zuffy-page.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useOnboardingViewModel } from "@/src/viewmodels/onboarding/useOnboardingViewModel";
import { router } from "expo-router";

export default function OnboardingZuffy() {
  const { showLogin } = useOnboardingViewModel();

  //onboarding zuffy
  function goToMoneySaved() {
    router.push(ROUTES.ONBOARDING_MONEY_SAVED);
  }

  return (
    <ScreenWrapper>
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
            onPress={goToMoneySaved}
            style={layout.bottomButtonContainer}
          />

          {showLogin && <LoginText />}
        </View>
      </View>
    </ScreenWrapper>
  );
}
