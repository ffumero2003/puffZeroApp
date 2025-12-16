import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Image, StyleSheet, View } from "react-native";

interface Props {
  icon: any; // imagen local
  value: string;
  label: string;
}

export default function FactItem({ icon, value, label }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.textContainer}>
        <AppText weight="extrabold" style={styles.value}>
          {value}
        </AppText>
        <AppText style={styles.label}>
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
    backgroundColor: Colors.light.secondary,
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
      color: Colors.light.primary,
    },
    label: {
      fontSize: 16,
      opacity: 0.7,
      marginTop: 2,
    },

});
