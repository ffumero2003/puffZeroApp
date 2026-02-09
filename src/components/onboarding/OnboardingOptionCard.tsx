import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import { TouchableOpacity, View } from "react-native";

interface Props {
  id: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function OnboardingOptionCard({
  title,
  description,
  selected,
  onPress,
}: Props) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        components.card,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.cardBorder,
        },
        selected && {
          backgroundColor: colors.inputBackground,
          borderColor: colors.primary,
        },
      ]}
    >
      <View style={[components.badge, { backgroundColor: colors.primary }]}>
        <AppText
          weight="extrabold"
          style={{ fontSize: 16, color: colors.textWhite }}
        >
          {title}
        </AppText>
      </View>

      <AppText weight="medium" style={{ fontSize: 18, color: colors.text }}>
        {description}
      </AppText>
    </TouchableOpacity>
  );
}
