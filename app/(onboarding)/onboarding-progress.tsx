import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { Image, View } from "react-native";

import ProgressScreen from "@/assets/images/onboarding/onboarding-progress-page.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { router } from "expo-router";

export default function OnboardingProgress() {
  //onboarding progress
  const colors = useThemeColors();
  function goToZuffy() {
    router.push(ROUTES.ONBOARDING_ZUFFY);
  }

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader step={1} total={11} />

        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={ProgressScreen}
            style={layout.bigImage}
            resizeMode="contain"
          />

          <AppText
            weight="bold"
            style={[layout.titleCenter, { color: colors.text }]}
          >
            Visualiza fácilmente tu progreso
          </AppText>

          <ContinueButton
            text="Continuar"
            onPress={goToZuffy}
            style={layout.bottomButtonContainer}
          />

          <LoginText />
        </View>
      </View>
    </ScreenWrapper>
  );
}
