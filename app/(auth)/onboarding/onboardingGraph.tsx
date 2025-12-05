import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import AppText from "../../../src/components/appText";
import KeepGoingButton from "../../../src/components/onboarding/keepGoingButton";
import LoginText from "../../../src/components/onboarding/loginText";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import { Colors } from "../../../src/constants/theme";

import Graph from "../../../assets/images/onboarding/onboardingGraph.png";

export default function OnboardingMoneySaved() {
  return (
    <>
      <View style={styles.headerContainer}>
        <OnboardingHeader  step={3} total={10}/>
      </View>
      <View style={styles.container}>
        
        <Image
          source={Graph}
          style={styles.phoneImage}
          resizeMode="contain"
        />

        <AppText weight="bold" style={styles.title}>
          Visualiza tu progreso día a día
        </AppText>

        <KeepGoingButton 
        text="Continuar"
        onPress={() => router.push("/(auth)/onboarding/onboardingPuffs")}
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
