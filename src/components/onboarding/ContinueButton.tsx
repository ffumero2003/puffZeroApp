import KeepGoingButton from "@/src/components/onboarding/KeepGoingButton";
import { components } from "@/src/styles/components";
import { Href, router } from "expo-router";
import { Vibration, View, ViewStyle } from "react-native";

interface ContinueButtonProps {
  text?: string;
  route?: string | Href;        // ahora es opcional
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;         // NUEVO 🔥 permite lógica personalizada
}

export default function ContinueButton({
  text = "Continuar",
  route,
  style,
  disabled = false,
  onPress,
}: ContinueButtonProps) {
  function handlePress() {
    if (disabled) {
          Vibration.vibrate(30); // 🔥 feedback suave cuando NO se puede tocar
          return;
    }

    if (onPress) {
      // 🔥 Usa la función personalizada (ej: handleRegister)
      onPress();
      return;
    }

    if (route) {
      // 🔥 Si no hay función, usa router.push como siempre
      router.push(route as Href);
    }
  }

  return (
    <View style={[components.bottomButtonContainer, style, disabled && { opacity: 0.6 }]}>
      <KeepGoingButton
        text={text}
        disabled={disabled}
        onPress={handlePress}
      />
    </View>
  );
}


