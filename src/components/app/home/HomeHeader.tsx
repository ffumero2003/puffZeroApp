// src/components/app/home/HomeHeader.tsx
import Logo from "@/assets/images/logo-puff-zero.png";
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Image, StyleSheet, View } from "react-native";

interface HomeHeaderProps {
  firstName: string;
  dailyGoal: number;
}

export default function HomeHeader({ firstName, dailyGoal }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText weight="bold" style={styles.title}>
          Hola, {firstName} 👋
        </AppText>
        <AppText style={styles.subtitle}>
          Tu meta diaria: {dailyGoal} puffs
        </AppText>
      </View>

      <View style={styles.cloudIcon}>
        <Image 
            source={Logo} 
            style={styles.cloudIcon} 
            resizeMode="contain" />
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
    width: "85%",
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
  },
  cloudIcon: {
    
    marginLeft: 12,
    height: 85,
    width: 85,
  },
});