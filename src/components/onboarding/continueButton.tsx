import { Href, router } from "expo-router";
import { StyleSheet, View, ViewStyle } from "react-native";
import KeepGoingButton from "./keepGoingButton";

interface ContinueButtonProps {
  text?: string;
  route: string | Href;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function ContinueButton({
  text = "Continuar",
  route,
  style,
  disabled = false,
}: ContinueButtonProps) {
  return (
    <View style={[styles.bottomButtonContainer, style, disabled && { opacity: 0.6 }]}>
      <KeepGoingButton
        text={text}
        disabled={disabled}
        onPress={() => !disabled && router.push(route as Href)}
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
