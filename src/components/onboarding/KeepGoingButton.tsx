import AppText from "@/src/components/AppText";
import { components } from "@/src/styles/components";
import { TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  text: string;
  onPress: () => void;
  style?: ViewStyle; // estilos opcionales para override
}

export default function KeepGoingButton({ text, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[components.button, style]}
      activeOpacity={0.7}
    >
      <AppText weight="bold" style={components.buttonText}>
        {text}
      </AppText>
    </TouchableOpacity>
  );
}


