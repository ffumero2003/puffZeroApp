import ZuffyImageDark from "@/assets/images/onboarding/dark/onboarding-zuffy-dark.png";
import ZuffyImageLight from "@/assets/images/onboarding/light/onboarding-zuffy-light.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import LoginText from "@/src/components/onboarding/LoginText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useTheme } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";
import { Dimensions, Image, View } from "react-native";

export default function OnboardingZuffy() {
  const { colors, activeTheme } = useTheme();
  const ZuffyImage = activeTheme === "light" ? ZuffyImageLight : ZuffyImageDark;

  function goToMoneySaved() {
    router.push(ROUTES.ONBOARDING_MONEY_SAVED);
  }

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader step={2} total={11} />

        <View style={{ width: "100%", alignItems: "center" }}>
          <Image
            source={ZuffyImage}
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
            Zuffy, tu acompañante en el proceso
          </AppText>

          <ContinueButton
            text="Continuar"
            onPress={goToMoneySaved}
            style={layout.bottomButtonContainer}
          />

          <LoginText />
        </View>
      </View>
    </ScreenWrapper>
  );
}
