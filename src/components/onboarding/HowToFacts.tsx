import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Dimensions, Image, StyleSheet, View } from "react-native";

interface Props {
  icon: any;
  text: string;
}

const screenWidth = Dimensions.get("window").width;
const iconSize = screenWidth * 0.19;
const wrapperSize = screenWidth * 0.2;

export default function HowToFacts({ icon, text }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: colors.secondary,
            width: wrapperSize,
            height: wrapperSize,
            borderRadius: wrapperSize / 2,
          },
        ]}
      >
        <Image
          source={icon}
          style={{ width: iconSize, height: iconSize, resizeMode: "contain" }}
        />
      </View>

      <View style={styles.textContainer}>
        <AppText weight="bold" style={[styles.text, { color: colors.text }]}>
          {text}
        </AppText>
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
    fontSize: 18,
    opacity: 0.7,
  },
});
