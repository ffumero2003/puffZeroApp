import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Image, StyleSheet, View } from "react-native";

interface Props {
  icon: any;
  text: string;
}

export default function HowToFacts({ icon, text }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.secondary }]}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.textContainer}>
        <AppText style={[styles.text, { color: colors.text }]}>{text}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textContainer: {
    maxWidth: "70%", // 🔥 controla el ancho

    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  iconWrapper: {
    width: 75,
    height: 75,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  icon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  text: {
    fontSize: 16,
    opacity: 0.7,
  },
});
