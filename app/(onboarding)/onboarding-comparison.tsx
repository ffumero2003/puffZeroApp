import { Image, View } from "react-native";

import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import TitleBlock from "../../src/components/onboarding/title-block";
import { Colors } from "../../src/constants/theme";

import { layout } from "@/src/styles/layout";


import ComparisonImage from "../../assets/images/onboarding/con-puff-zero.png";

export default function OnboardingComparison() {
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
          route="/onboarding-goal"
          style={{ paddingBottom: 30 }}
        />
    </View>
  );
}


