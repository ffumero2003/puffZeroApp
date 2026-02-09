// src/components/app/settings/SettingsHeader.tsx
import Logo from "@/assets/images/logo-puff-zero.png";
import AppText from "@/src/components/AppText";
// NEW: Dynamic colors
import { useThemeColors } from "@/src/providers/theme-provider";
import { Image, StyleSheet, View } from "react-native";

export default function SettingsHeader() {
  // NEW: Dynamic colors
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {/* NEW: Dynamic title color */}
        <AppText weight="bold" style={[styles.title, { color: colors.text }]}>
          Tu Pérfil
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
