import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { Dimensions, Image, View } from "react-native";

import HomePageDark from "@/assets/images/onboarding/dark/onboarding-home-page-dark.png";
import HomePageLight from "@/assets/images/onboarding/light/onboarding-home-light.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useTheme } from "@/src/providers/theme-provider";
import { router } from "expo-router";

export default function Onboarding() {
  //onboarding
  const { colors, activeTheme } = useTheme();
  function goToProgress() {
    router.push(ROUTES.ONBOARDING_PROGRESS);
  }

  const HomePage = activeTheme === "light" ? HomePageLight : HomePageDark;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader
          step={0}
          total={11}
          showBack={false}
          showProgress={false}
        />

        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={HomePage}
            style={{
              width: screenWidth * 0.9,
              height: screenHeight * 0.55,
            }}
            resizeMode="contain"
          />

          <AppText
            weight="bold"
            style={[layout.titleCenter, { color: colors.text }]}
          >
            Lleva tu consumo al día, sin complicaciones
          </AppText>

          <ContinueButton
            text="Continuar"
            onPress={goToProgress}
            style={layout.bottomButtonContainer}
          />

          <LoginText />
        </View>
      </View>
    </ScreenWrapper>
  );
}
