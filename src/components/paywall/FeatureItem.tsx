import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { ReactNode } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
interface Props {
  icon: any;
  text: ReactNode;
}

export default function FeatureItem({ icon, text }: Props) {
  const colors = useThemeColors();
  const screenWidth = Dimensions.get("window").width;
  const iconSize = screenWidth * 0.14; // ~50pt on standard phones
  return (
    <View style={styles.container}>
      <Image
        source={icon}
        style={{ width: iconSize, height: iconSize, marginRight: 14 }}
        resizeMode="contain"
      />

      <AppText weight="semibold" style={[styles.text, { color: colors.text }]}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  icon: {
    width: 50,
    height: 50,
    marginRight: 14,
  },

  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
