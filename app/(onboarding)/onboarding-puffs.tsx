import Slider from "@react-native-community/slider";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";
import { getAddictionLevel } from "@/src/utils/addiction";
import { usePuffsViewModel } from "@/src/viewmodels/onboarding/usePuffsViewModel";

import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function OnboardingPuffs() {
  const [value, setValue] = useState(0);
  const { continueWithPuffs, isValidPuffs } = usePuffsViewModel();

  // 🔥 Animaciones (UI PURA)
  const animatedValue = useSharedValue(0);
  const labelAnim = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 250 });
    labelAnim.value = 0;
    labelAnim.value = withTiming(1, { duration: 250 });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    text: Math.round(animatedValue.value).toString(),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelAnim.value,
    transform: [
      { scale: 0.9 + labelAnim.value * 0.1 },
      { translateY: (1 - labelAnim.value) * 6 },
    ],
  }));

  const addiction = getAddictionLevel(value);
  
  return (
    <View style={layout.screenContainer}>
      <View >
        <OnboardingHeader step={5} total={11} />

      <View style={layout.content}>
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
      </View>

      <ContinueButton
        text="Continuar"
        disabled={!isValidPuffs(value)}
        onPress={() => continueWithPuffs(value)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  
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
