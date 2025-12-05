import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../../src/components/appText";
import KeepGoingButton from "../../../src/components/onboarding/keepGoingButton";
import LoginText from "../../../src/components/onboarding/loginText";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import { Colors } from "../../../src/constants/theme";

import MoneySaved from "../../../assets/images/onboarding/onboardingMoneySaved.png";

export default function OnboardingMoneySaved() {
  return (
    <>
      <View style={styles.headerContainer}>
        <OnboardingHeader  step={2} total={10}/>
      </View>
      <View style={styles.container}>
        
        <Image
          source={MoneySaved}
          style={styles.phoneImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={styles.title}>
          Cada puff evitado suma a tu ahorro
        </AppText>

        <KeepGoingButton 
        text="Continuar"
        onPress={() => router.push("/(auth)/onboarding/onboardingGraph")}
        />

        <LoginText />

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 30,
  },
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
