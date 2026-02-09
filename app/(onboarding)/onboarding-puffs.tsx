// onboarding-puffs.tsx
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
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
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { getAddictionLevel } from "@/src/utils/addiction";
import { usePuffsViewModel } from "@/src/viewmodels/onboarding/usePuffsViewModel";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function OnboardingPuffs() {
  const colors = useThemeColors();
  const [value, setValue] = useState(0);
  const { submitPuffs, isValidPuffs } = usePuffsViewModel();

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

  const handleContinue = () => {
    const ok = submitPuffs(value);
    if (ok) {
      router.push(ROUTES.ONBOARDING_MONEY_SPENT);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <View>
          <OnboardingHeader step={5} total={11} />

          <View style={layout.content}>
            <TitleBlock
              title="¿Cuántos puffs consumís por día?"
              subtitle="No tiene que ser exacto. Si en los primeros días notamos que el límite es muy bajo, lo ajustamos sin problema."
            />

            <Slider
              style={styles.slider}
              value={value}
              onValueChange={setValue}
              minimumValue={0}
              maximumValue={400}
              step={1}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.secondary}
              thumbTintColor={colors.primary}
            />

            <AnimatedTextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBackground, color: colors.text },
              ]}
              editable={false}
              animatedProps={animatedProps}
            />

            <Animated.View style={labelStyle}>
              <AppText
                weight="semibold"
                style={[styles.classification, { color: colors.primary }]}
              >
                {addiction}
              </AppText>
            </Animated.View>
          </View>
        </View>

        <ContinueButton
          text="Continuar"
          disabled={!isValidPuffs(value)}
          onPress={handleContinue}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    height: 50,
  },
  input: {
    marginTop: 20,
    borderRadius: 12,
    width: 120,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 22,
    textAlign: "center",
    alignSelf: "center",
    fontFamily: "Manrope_600SemiBold",
  },
  classification: {
    textAlign: "center",
    fontSize: 22,
    marginTop: 20,
  },
});
