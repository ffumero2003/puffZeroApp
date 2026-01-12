// src/components/home/WeekDayCircle.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  day: string;
  puffs: number;
  isToday: boolean;
  isActive: boolean;
  onPress: () => void;
};

export default function WeekDayCircle({ day, puffs, isToday, isActive, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        isActive && styles.active,
      ]}
      activeOpacity={0.7}
    >
      <AppText
        weight="semibold"
        style={[
          styles.text,
          isActive && styles.textActive,
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
    backgroundColor: Colors.light.secondary,
    alignItems: "center",
    justifyContent: "center",
    
  },
  active: {
    backgroundColor: Colors.light.primary,
  },
  text: {
    fontSize: 13,
    color: Colors.light.text,
  },
  textActive: {
    color: Colors.light.textWhite,
  },
});