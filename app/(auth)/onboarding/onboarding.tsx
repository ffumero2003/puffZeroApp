import { Image, StyleSheet, View } from "react-native";
import HomeScreen from "../../../assets/images/onboarding/onboarding-home-page.png";
import AppText from "../../../src/components/app-text";
import ContinueButton from "../../../src/components/onboarding/continue-button";
import LoginText from "../../../src/components/onboarding/login-text";
import { Colors } from "../../../src/constants/theme";

export default function Onboarding() {
  return (
    <View style={styles.container}>
      
      <Image
        source={HomeScreen}
        style={styles.phoneImage}
        resizeMode="contain"
      />

      <AppText style={styles.title} weight="extrabold">
        Lleva tu consumo al día, sin complicaciones
      </AppText>

      
      <ContinueButton 
        text="Empieza Sesión"
        route="/(auth)/onboarding/onboarding-progress"
      />

      <LoginText />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  phoneImage: {
    width: "100%",
    height: 430,
  },
  title: {
    marginTop: 30,
    fontSize: 28,
    color: Colors.light.text,
    textAlign: "center",
  },

 
});
