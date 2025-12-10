import { Image, View } from "react-native";
import HomeScreen from "../../assets/images/onboarding/onboarding-home-page.png";
import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import LoginText from "../../src/components/onboarding/login-text";
import { layout } from "../../src/styles/layout";

export default function Onboarding() {
  return (
    <View style={layout.container}>
      
      <Image
        source={HomeScreen}
        style={layout.bigImage}
        resizeMode="contain"
      />

      <AppText style={layout.titleCenter} weight="extrabold">
        Lleva tu consumo al día, sin complicaciones
      </AppText>

      
      <ContinueButton 
        text="Empieza Sesión"
        route="/onboarding-progress"
      />

      <LoginText />

    </View>
  );
}


