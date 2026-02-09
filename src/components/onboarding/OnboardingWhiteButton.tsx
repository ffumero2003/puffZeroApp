import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import { TouchableOpacity } from "react-native";

export default function OnboardingWhiteButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      style={[
        components.buttonWhite,
        { backgroundColor: colors.secondaryBackground },
        { borderColor: colors.cardBorder },
      ]}
      activeOpacity={0.55}
      onPress={onPress}
    >
      <AppText
        weight="semibold"
        style={[components.textWhite, { color: colors.text }]}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
