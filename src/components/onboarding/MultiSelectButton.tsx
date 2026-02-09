import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import { TouchableOpacity } from "react-native";

export default function MultiSelectButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        components.multiButton,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
        selected && {
          backgroundColor: colors.inputBackground,
          borderColor: colors.primary,
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText
        weight="semibold"
        style={[
          { fontSize: 20, color: colors.text },
          selected && { color: colors.primary },
        ]}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
