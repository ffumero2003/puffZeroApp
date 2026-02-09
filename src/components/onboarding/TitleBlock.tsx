import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { View } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
}

export default function TitleBlock({ title, subtitle }: Props) {
  const colors = useThemeColors();
  return (
    <View>
      <AppText weight="bold" style={[layout.title, { color: colors.text }]}>
        {title}
      </AppText>

      {subtitle && (
        <AppText style={[layout.subtitle, { color: colors.text }]}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
}
