import { View } from "react-native";
import { layout } from "../../../src/styles/layout";
import AppText from "../AppText";

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


