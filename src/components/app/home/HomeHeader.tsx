// src/components/app/home/HomeHeader.tsx
import Logo from "@/assets/images/logo-puff-zero.png";
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Dimensions, Image, StyleSheet, View } from "react-native";

interface HomeHeaderProps {
  firstName: string;
  dailyGoal: number;
}

export default function HomeHeader({ firstName, dailyGoal }: HomeHeaderProps) {
  const colors = useThemeColors();
  const screenWidth = Dimensions.get("window").width;
  const logoSize = screenWidth * 0.25; // 20% of screen width

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

      <View style={{ marginLeft: 12 }}>
        <Image
          source={Logo}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
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
    fontSize: 26,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  cloudIcon: {
    marginLeft: 12,
    height: 85,
    width: 85,
  },
});
