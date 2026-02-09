import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import { TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  text: string;
  onPress: () => void;
  style?: ViewStyle; // estilos opcionales para override
}

export default function KeepGoingButton({ text, onPress, style }: Props) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[components.button, style, { backgroundColor: colors.primary }]}
      activeOpacity={0.7}
    >
      <AppText
        weight="bold"
        style={[components.buttonText, { color: colors.textWhite }]}
      >
        {text}
      </AppText>
    </TouchableOpacity>
  );
}
