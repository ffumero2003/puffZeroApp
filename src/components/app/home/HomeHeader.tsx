// src/components/app/home/HomeHeader.tsx
import Logo from "@/assets/images/logo-puff-zero.png";
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Image, StyleSheet, View } from "react-native";

interface HomeHeaderProps {
  firstName: string;
  dailyGoal: number;
}

export default function HomeHeader({ firstName, dailyGoal }: HomeHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText weight="bold" style={[styles.title, { color: colors.text }]}>
          Hola, {firstName} 👋
        </AppText>
        <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tu meta diaria: <AppText weight="bold">{dailyGoal} puffs</AppText>
        </AppText>
      </View>

      <View style={styles.cloudIcon}>
        <Image source={Logo} style={styles.cloudIcon} resizeMode="contain" />
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
  },
  cloudIcon: {
    marginLeft: 12,
    height: 85,
    width: 85,
  },
});
