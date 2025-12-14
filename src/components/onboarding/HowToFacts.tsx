import { Image, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/theme";
import AppText from "../AppText";

interface Props {
  icon: any;
  text: string;
}

export default function HowToFacts({ icon, text }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} />
      </View>

      <View style={styles.textContainer}>
        <AppText weight="bold" style={styles.text}>
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
    backgroundColor: Colors.light.secondary,
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
  },
});
