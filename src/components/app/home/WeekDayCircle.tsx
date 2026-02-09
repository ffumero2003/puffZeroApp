// src/components/home/WeekDayCircle.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import * as Haptics from "expo-haptics";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  day: string;
  puffs: number;
  isToday: boolean;
  isActive: boolean;
  onPress: () => void;
};

export default function WeekDayCircle({
  day,
  puffs,
  isToday,
  isActive,
  onPress,
}: Props) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[
        styles.container,
        { backgroundColor: isActive ? colors.primary : colors.secondary },
      ]}
      activeOpacity={0.7}
    >
      <AppText
        weight="bold"
        style={[
          styles.text,
          { color: isActive ? colors.textWhite : colors.text },
        ]}
      >
        {day}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
  },
});
