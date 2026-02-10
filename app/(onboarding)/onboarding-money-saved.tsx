import MoneySavedDark from "@/assets/images/onboarding/dark/money-saved-dark.png";
import MoneySavedLight from "@/assets/images/onboarding/light/money-saved-light.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useTheme } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";
import { Dimensions, Image, View } from "react-native";
export default function OnboardingMoneySaved() {
  //onboarding money saved
  const { colors, activeTheme } = useTheme();
  function goToGraph() {
    router.push(ROUTES.ONBOARDING_GRAPH);
  }

  const MoneySaved = activeTheme === "light" ? MoneySavedLight : MoneySavedDark;
  const screenWidth = Dimensions.get("window").width;

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        {/* 🔵 GROUP 1 — Header + Imagen + Título */}
        <View>
          <OnboardingHeader step={3} total={11} />

          <View style={{ alignItems: "center", marginTop: 80 }}>
            <Image
              source={MoneySaved}
              style={{
                width: screenWidth * 0.9, // 85% of screen width
                height: screenWidth * 0.9 * 0.85, // maintain aspect ratio (~4:3)
                marginTop: 30,
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 🟢 GROUP 2 — botón + login */}
        <View style={{ width: "100%" }}>
          <AppText
            weight="bold"
            style={[layout.titleCenter, { color: colors.text }]}
          >
            Cada puff evitado suma a tu ahorro
          </AppText>

          <ContinueButton
            text="Continuar"
            onPress={goToGraph}
            style={layout.bottomButtonContainer}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
