import BackArrow from "@/assets/images/icons/back.png";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  step?: number; // opcional para login
  total?: number; // opcional para login
  showBack?: boolean; // mostrar botón back
  showProgress?: boolean; // mostrar u ocultar progress bar
  style?: ViewStyle;
}

export default function OnboardingHeader({
  step = 1,
  total = 1,
  showBack = true,
  showProgress = true,
  style,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  const percentage = step / total;

  useEffect(() => {
    if (showProgress) {
      Animated.timing(progress, {
        toValue: percentage,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [step, showProgress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const colors = useThemeColors();

  return (
    <View style={[components.wrapper, style]}>
      {showBack && (
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={components.backButton}
        >
          <Image
            source={BackArrow}
            style={{ width: 30, height: 30, tintColor: colors.text }}
          />
        </TouchableOpacity>
      )}

      {showProgress && (
        <View
          style={[
            components.progressContainer,
            { backgroundColor: colors.secondary },
          ]}
        >
          <Animated.View
            style={[
              components.progressFill,
              { width: widthInterpolated, backgroundColor: colors.primary },
            ]}
          />
        </View>
      )}
    </View>
  );
}
