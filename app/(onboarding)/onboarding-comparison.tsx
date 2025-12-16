import { Image, View } from "react-native";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import { Colors } from "@/src/constants/theme";

import { layout } from "@/src/styles/layout";

import ComparisonImage from "@/assets/images/onboarding/con-puff-zero.png";

import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";

export default function OnboardingComparison() {

  //onboarding comparison
  function goToGoal() {
    router.push(ROUTES.ONBOARDING_GOAL)
  }
  
  return (
    <View style={layout.screenContainer}>
      <View>
        <OnboardingHeader step={7} total={11} />

        <View style={layout.content}>
          <TitleBlock
            title="Avanzá hacia una vida sin vape el doble de rápido"
            subtitle="Tu transición al dejar el vape"
          />

          {/* Imagen completa */}
          <Image
            source={ComparisonImage}
            style={layout.image}
            resizeMode="contain"
          />

          {/* Texto inferior */}
          <AppText style={layout.description}>
            Puff
            <AppText
              weight="extrabold"
              style={{ color: Colors.light.primary }}
            >
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
  );
}


