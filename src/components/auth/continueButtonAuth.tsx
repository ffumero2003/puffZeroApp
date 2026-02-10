import KeepGoingButton from "@/src/components/onboarding/KeepGoingButton";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import * as Haptics from "expo-haptics";
import { Href, router } from "expo-router";
import { useEffect, useRef } from "react"; // <-- NEW
import { Animated, Vibration, ViewStyle } from "react-native"; // <-- NEW: Animated

interface ContinueButtonProps {
  text?: string;
  route?: string | Href;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
}

export default function ContinueButtonAuth({
  text = "Continuar",
  route,
  style,
  disabled = false,
  onPress,
}: ContinueButtonProps) {
  const colors = useThemeColors();

  // ─── Animated opacity: smoothly transitions when disabled changes ───
  const opacity = useRef(new Animated.Value(disabled ? 0.6 : 1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: disabled ? 0.6 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [disabled]);

  function handlePress() {
    if (disabled) {
      Vibration.vibrate(30);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (onPress) {
      onPress();
      return;
    }

    if (route) {
      router.push(route as Href);
    }
  }

  return (
    // Changed View → Animated.View
    <Animated.View
      style={[components.bottomButtonContainerAuth, style, { opacity }]}
    >
      <KeepGoingButton text={text} disabled={disabled} onPress={handlePress} />
    </Animated.View>
  );
}
