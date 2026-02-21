import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { Dimensions, Image, View } from "react-native";

import ProgressScreenDark from "@/assets/images/onboarding/dark/onboarding-progress-dark.png";
import ProgressScreenLight from "@/assets/images/onboarding/light/onboarding-progress-light.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useTheme } from "@/src/providers/theme-provider";
import { router } from "expo-router";

export default function OnboardingProgress() {
  //onboarding progress
  const { colors, activeTheme } = useTheme();
  function goToZuffy() {
    router.push(ROUTES.ONBOARDING_ZUFFY);
  }

  const ProgressScreen =
    activeTheme === "light" ? ProgressScreenLight : ProgressScreenDark;

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader step={1} total={11} />

        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={ProgressScreen}
            style={{
              width: screenWidth * 0.9,
              height: screenHeight * 0.55, // taller aspect ratio for phone mockups
            }}
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
