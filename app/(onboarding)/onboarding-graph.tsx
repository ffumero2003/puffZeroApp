import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { layout } from "@/src/styles/layout";
import { Dimensions, Image, View } from "react-native";

import GraphDark from "@/assets/images/onboarding/dark/graph-dark.png";
import GraphLight from "@/assets/images/onboarding/light/graph-light.png";
import AppText from "@/src/components/AppText";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useTheme } from "@/src/providers/theme-provider";
import { router } from "expo-router";
export default function OnboardingGraph() {
  //onboarding money saved
  const { colors, activeTheme } = useTheme();
  function goToPuffCount() {
    router.push(ROUTES.ONBOARDING_PUFFS);
  }
  const screenWidth = Dimensions.get("window").width;

  const Graph = activeTheme === "light" ? GraphLight : GraphDark;

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        {/* 🔵 GROUP 1 — contenido superior */}
        <View>
          <OnboardingHeader step={4} total={11} />

          <View style={{ alignItems: "center", marginTop: 80 }}>
            {/* Text on top */}

            {/* Image in the middle, below the text */}
            <Image
              source={Graph}
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
            Visualiza tu progreso día a día
          </AppText>

          <ContinueButton
            text="Continuar"
            onPress={goToPuffCount}
            style={layout.bottomButtonContainer}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
