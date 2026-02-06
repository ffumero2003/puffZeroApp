// src/components/app/progress/ProgressHeader.tsx
import Logo from "@/assets/images/logo-puff-zero.png";
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Image, StyleSheet, View } from "react-native";

interface ProgressHeaderProps {
  timeSinceLastPuff: string;
}

export default function ProgressHeader({
  timeSinceLastPuff,
}: ProgressHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText weight="bold" style={styles.title}>
          Tu Progreso
        </AppText>
        <AppText style={styles.subtitle}>
          Última actualización:{" "}
          <AppText weight="bold">{timeSinceLastPuff}</AppText>
        </AppText>
      </View>

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    opacity: 0.7,
  },
  logoContainer: {
    marginLeft: 12,
  },
  logo: {
    height: 85,
    width: 85,
  },
});
