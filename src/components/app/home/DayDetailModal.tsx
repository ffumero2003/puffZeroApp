// src/components/home/DayDetailModal.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  day: string;
  date: string;
  puffs: number;
  onClose: () => void;
};

export default function DayDetailModal({ visible, day, date, puffs, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modal}>
          <Pressable onPress={() => {}} style={styles.content}>
            <View style={styles.header}>
              <AppText weight="bold" style={styles.title}>
                {day}
              </AppText>
              <Pressable onPress={onClose}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <AppText style={styles.date}>{date}</AppText>

            <View style={styles.puffsContainer}>
              <AppText weight="bold" style={styles.puffsNumber}>
                {puffs}
              </AppText>
              <AppText style={styles.puffsLabel}>Puffs consumidos</AppText>
            </View>
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
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 24,
  },
  content: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: Colors.light.text,
  },
  date: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  puffsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  puffsNumber: {
    fontSize: 48,
    color: Colors.light.primary,
  },
  puffsLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 8,
  },
});