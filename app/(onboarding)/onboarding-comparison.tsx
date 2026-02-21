import { Dimensions, Image, View } from "react-native";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import TitleBlock from "@/src/components/onboarding/TitleBlock";

import ConPuffZeroDark from "@/assets/images/onboarding/dark/con-puff-zero-dark.png";
import ConPuffZeroLight from "@/assets/images/onboarding/light/con-puff-zero-light.png";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useTheme } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";

import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";

export default function OnboardingComparison() {
  const { colors, activeTheme } = useTheme();

  //onboarding comparison
  function goToGoal() {
    router.push(ROUTES.ONBOARDING_GOAL);
  }

  const conPuffZero =
    activeTheme === "light" ? ConPuffZeroLight : ConPuffZeroDark;

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <View style={{ flex: 1 }}>
          <OnboardingHeader step={7} total={11} />

          <View style={layout.content}>
            <TitleBlock
              title="Avanzá hacia una vida sin vape el doble de rápido"
              subtitle="Tu transición al dejar el vape"
            />

            <Image
              source={conPuffZero}
              style={{
                width: screenWidth * 0.9,
                height: screenWidth * 0.95 * 0.85,
                marginVertical: 20,
              }}
              resizeMode="contain"
              accessibilityLabel="Comparación: con y sin Puff Zero"
            />

            {/* Texto inferior */}
            <AppText style={[layout.description, { color: colors.text }]}>
              Puff
              <AppText weight="extrabold" style={{ color: colors.primary }}>
                Zero
              </AppText>{" "}
              te acompaña, te motiva y te ayuda a mantenerte constante.
            </AppText>
          </View>
        </View>
        <ContinueButton
          text="Continuar"
          onPress={goToGoal}
          style={layout.bottomButtonContainer}
        />
      </View>
    </ScreenWrapper>
  );
}
