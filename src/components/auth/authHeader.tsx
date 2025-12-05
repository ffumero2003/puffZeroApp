import { Image, StyleSheet, View } from "react-native";
import Logo from "../../../assets/images/logoPuffZero.png";
import { Colors } from "../../constants/theme";
import AppText from "../appText";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextContainer}>
        <AppText weight="bold" style={styles.title}>
          {title}
        </AppText>

        <AppText weight="semibold" style={styles.subtitle}>
          {subtitle}
        </AppText>
      </View>

      <Image
        source={Logo}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 30,
    color: Colors.light.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    opacity: 0.5,
  },

  headerLogo: {
    width: 85,
    height: 85,
  },
});
