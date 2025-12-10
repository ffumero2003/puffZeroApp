import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import TitleBlock from "../../src/components/onboarding/title-block";
import { Colors } from "../../src/constants/theme";
import { useOnboarding } from "../../src/providers/onboarding-provider";

import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function OnboardingPuffs() {
  const [value, setValue] = useState(0);

  const { setPuffs } = useOnboarding();

  // Counter animado
  const animatedValue = useSharedValue(0);
  const animatedProps = useAnimatedProps(() => ({
    text: Math.round(animatedValue.value).toString(),
  }));

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 250 });
  }, [value]);

  function getAddictionLevel(n: number) {
    if (n > 300) return "Super Pesada";
    if (n > 175) return "Pesada";
    if (n >= 75) return "Normal";
    return "Suave";
  }

  const addiction = getAddictionLevel(value);

  // 🔥 Animación del label
  const labelAnim = useSharedValue(0);

  useEffect(() => {
    labelAnim.value = 0;
    labelAnim.value = withTiming(1, { duration: 250 });
  }, [addiction]);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelAnim.value,
    transform: [
      { scale: 0.9 + labelAnim.value * 0.1 },     // zoom sutil
      { translateY: (1 - labelAnim.value) * 6 },  // baja → sube
    ],
  }));

  return (
    <View style={styles.container}>
      <OnboardingHeader step={5} total={11} />

      <View style={styles.content}>
        <TitleBlock
          title="¿Cuántos puffs consumís por día?"
          subtitle="No tiene que ser exacto. Si en los primeros días notamos que el límite es muy bajo, lo ajustamos sin problema."
        />

        {/* Slider */}
        <Slider
          style={styles.slider}
          value={value}
          onValueChange={setValue}
          minimumValue={0}
          maximumValue={400}
          step={1}
          minimumTrackTintColor={Colors.light.primary}
          maximumTrackTintColor="#CFCBFF"
          thumbTintColor={Colors.light.primary}
        />

        {/* Counter animado */}
        <AnimatedTextInput
          style={styles.input}
          editable={false}
          animatedProps={animatedProps}
        />

        {/* 🔥 Label animado */}
        <Animated.View style={labelStyle}>
          <AppText weight="semibold" style={styles.classification}>
            {addiction}
          </AppText>
        </Animated.View>
      </View>

      <ContinueButton
        text="Continuar"
        disabled={value < 20}
        onPress={() => {
          setPuffs(value);
          console.log("Puffs guardados en provider:", value);   // 👈 prueba
          router.push("/onboarding-money-spent");
        }}
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
    marginTop: 40,
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
});
