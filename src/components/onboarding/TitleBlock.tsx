import AppText from "@/src/components/AppText";
import { layout } from "@/src/styles/layout";
import { View } from "react-native";


interface Props {
  title: string;
  subtitle?: string;
}

export default function TitleBlock({ title, subtitle }: Props) {
  return (
    <View>
      <AppText weight="bold" style={layout.title}>
        {title}
      </AppText>

      {subtitle && (
        <AppText style={layout.subtitle}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
}


