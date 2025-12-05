import TitleBlock from "@/src/components/onboarding/titleBlock";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import AppText from "../../../src/components/appText";
import ContinueButton from "../../../src/components/onboarding/continueButton";
import OnboardingHeader from "../../../src/components/onboarding/onboardingHeader";
import { Colors } from "../../../src/constants/theme";

export default function OnboardingPuffs() {
  const [value, setValue] = useState(0);
  const [inputValue, setInputValue] = useState("");

  function getAddictionLevel(n: number) {
    if (n > 300) return "Super Pesada"
    if (n > 175) return "Pesada";
    if (n >= 75) return "Normal";
    return "Suave";
  }

  const addiction = getAddictionLevel(value);

  return (
    <View style={styles.container}>

      <OnboardingHeader step={4} total={10} />

      {/* CONTENIDO */}
      <View style={styles.content}>
        <TitleBlock
          title="¿Cuántos puffs consumís por día?"
          subtitle="Podés indicar un número aproximado, si en los primeros días vemos que el límite es muy bajo, lo ajustaremos sin problema."
        />


        <Slider
          style={styles.slider}
          value={value}
          onValueChange={setValue}
          minimumValue={0}
          maximumValue={400}
          minimumTrackTintColor={Colors.light.primary}
          maximumTrackTintColor="#CFCBFF"
          thumbTintColor={Colors.light.primary}
          step={1}
        />

        <TextInput
          style={styles.input}
          value={String(value)}
          onChangeText={(text) => {
            const num = Number(text);
            if (!isNaN(num)) {
              setValue(num);
            }
          }}
          keyboardType="numeric"
        />

        <AppText weight="semibold" style={styles.classification}>
          {addiction}
        </AppText>
      </View>

     

      <ContinueButton 
      text="Continuar"
      route="/(auth)/onboarding/onboardingMoneySpent"
      style={{ paddingBottom: 30 }}
      />

    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
   
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 60,
  },
  slider: {
    width: "100%",
    height: 50,
  },
  input: {
    marginTop: 20,
    backgroundColor: "#E6E4FF",
    borderRadius: 12,
    width: 120,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 22,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "Manrope_600SemiBold",
    color: Colors.light.text,
  },
  classification: {
    textAlign: "center",
    fontSize: 22,
    color: Colors.light.primary,
    marginTop: 20,
  },
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 40,
},
});
