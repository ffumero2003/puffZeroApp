import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

interface Props {
  value: string;
  icon: ImageSourcePropType;
  label: string;
}

export default function FactItem({ icon, value, label }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.secondary }]}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.textContainer}>
        <AppText
          weight="extrabold"
          style={[styles.value, { color: colors.primary }]}
        >
          {value}
        </AppText>
        <AppText style={[styles.label, { color: colors.text }]}>
          {label}
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
  iconWrapper: {
    width: 75,
    height: 75,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  icon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  text: {
    flex: 1,
  },
  textContainer: {
    maxWidth: "70%", // 🔥 ahora SÍ funciona
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  value: {
    fontSize: 22,
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 2,
  },
});
