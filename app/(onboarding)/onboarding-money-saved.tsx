import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../src/components/app-text";
import KeepGoingButton from "../../src/components/onboarding/keep-going-button";
import LoginText from "../../src/components/onboarding/login-text";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import { Colors } from "../../src/constants/theme";

import MoneySaved from "../../assets/images/onboarding/onboarding-money-saved.png";

export default function OnboardingMoneySaved() {
  return (
    <>
      <View style={styles.headerContainer}>
        <OnboardingHeader  step={3} total={11}/>
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
        onPress={() => router.push("/onboarding-graph")}
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
