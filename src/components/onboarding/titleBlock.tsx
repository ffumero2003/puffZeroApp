import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/theme";
import AppText from "../appText";

interface Props {
  title: string;
  subtitle?: string;
}

export default function TitleBlock({ title, subtitle }: Props) {
  return (
    <View>
      <AppText weight="bold" style={styles.title}>
        {title}
      </AppText>

      {subtitle && (
        <AppText style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: Colors.light.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    marginBottom: 25,
    opacity: 0.5
  },
});
