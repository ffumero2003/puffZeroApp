// src/components/home/DayDetailModal.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  day: string;
  date: string;
  puffs: number;
  dailyGoal: number; // <-- NEW PROP
  onClose: () => void;
};

export default function DayDetailModal({
  visible,
  day,
  date,
  puffs,
  dailyGoal,
  onClose,
}: Props) {
  const colors = useThemeColors();

  // -- Compute the goal status message and color --
  const difference = puffs - dailyGoal;
  let goalMessage: string;
  let goalColor: string;

  if (puffs === 0) {
    // No puffs recorded (future day or no data)
    goalMessage = "Sin datos registrados";
    goalColor = colors.textSecondary;
  } else if (difference < 0) {
    // Under goal — good
    goalMessage = `${Math.abs(difference)} puffs por debajo de tu meta!`;
    goalColor = colors.success;
  } else if (difference === 0) {
    // Exactly at goal
    goalMessage = "Justo en tu meta";
    goalColor = colors.warning;
  } else {
    // Over goal — bad
    goalMessage = `Superaste tu meta por ${difference} puffs`;
    goalColor = colors.danger;
  }

  // -- Map abbreviations to full day names --
  const dayAbbreviations: Record<string, string> = {
    Dom: "Domingo",
    Lun: "Lunes",
    Mar: "Martes",
    Mier: "Miércoles",
    Jue: "Jueves",
    Vie: "Viernes",
    Sab: "Sábado",
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClose();
        }}
      >
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            style={[styles.content, { backgroundColor: colors.card }]}
          >
            <View style={styles.header}>
              <AppText
                weight="bold"
                style={[styles.title, { color: colors.text }]}
              >
                {dayAbbreviations[day] || day}
              </AppText>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <AppText style={[styles.date, { color: colors.textSecondary }]}>
              {date}
            </AppText>

            <View style={styles.puffsContainer}>
              <AppText
                weight="bold"
                style={[styles.puffsNumber, { color: colors.primary }]}
              >
                {puffs}
              </AppText>
              <AppText style={[styles.puffsLabel, { color: colors.text }]}>
                Puffs consumidos
              </AppText>
            </View>

            {/* -- NEW: Goal status message -- */}
            <AppText
              weight="semibold"
              style={[styles.goalMessage, { color: goalColor }]}
            >
              {goalMessage}
            </AppText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",

    borderRadius: 20,
    padding: 20,
  },
  content: {
    gap: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
  },
  date: {
    fontSize: 16,
  },
  puffsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  puffsNumber: {
    fontSize: 48,
  },
  puffsLabel: {
    fontSize: 16,
    marginTop: 8,
  },
  // -- NEW STYLE --
  goalMessage: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 4,
  },
});
