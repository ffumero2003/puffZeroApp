import KeepGoingButton from "@/src/components/onboarding/KeepGoingButton";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import * as Haptics from "expo-haptics";
import { Href, router } from "expo-router";
import { Vibration, View, ViewStyle } from "react-native";
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
  function handlePress() {
    if (disabled) {
      Vibration.vibrate(30); // 🔥 feedback suave cuando NO se puede tocar
      return;
    }

    // 🔥 Haptic feedback cuando SÍ se puede tocar
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
    <View
      style={[
        components.bottomButtonContainerAuth,
        style,
        disabled && { opacity: 0.6 },
      ]}
    >
      <KeepGoingButton text={text} disabled={disabled} onPress={handlePress} />
    </View>
  );
}
