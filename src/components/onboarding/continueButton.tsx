import { Href, router } from "expo-router";
import { StyleSheet, View, ViewStyle } from "react-native";
import KeepGoingButton from "./keepGoingButton";

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
    if (disabled) return;

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
    <View style={[styles.bottomButtonContainer, style, disabled && { opacity: 0.6 }]}>
      <KeepGoingButton
        text={text}
        disabled={disabled}
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    width: "100%",
    paddingBottom: 0,
  },
});
