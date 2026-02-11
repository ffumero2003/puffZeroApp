// src/components/app/home/RelapseModal.tsx
// Modal shown when a user who successfully completed their plan adds a puff.
// Offers to start a new plan or dismiss.

import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const SPEED_OPTIONS = [
  { id: "14", title: "14 DÍAS — SPRINT RÁPIDO  ⚡" },
  { id: "21", title: "21 DÍAS — NUEVO HÁBITO  💪" },
  { id: "30", title: "30 DÍAS — REINICIO COMPLETO  ✨" },
  { id: "60", title: "2 MESES — CAMINO ESTABLE  🚀" },
  { id: "90", title: "3 MESES — CAMBIO COMPLETO  ♻️" },
];

interface RelapseModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectNewPlan: (newGoalSpeed: string) => void;
}

export default function RelapseModal({
  visible,
  onDismiss,
  onSelectNewPlan,
}: RelapseModalProps) {
  const colors = useThemeColors();
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null);

  const handleConfirmNewPlan = () => {
    if (!selectedSpeed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSelectNewPlan(selectedSpeed);
    setShowSpeedPicker(false);
    setSelectedSpeed(null);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              {!showSpeedPicker ? (
                // ─── Step 1: Encourage the user ───
                <>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: colors.warning + "20" },
                    ]}
                  >
                    <AppText style={styles.iconEmoji}>🫂</AppText>
                  </View>

                  <AppText
                    weight="bold"
                    style={[styles.title, { color: colors.text }]}
                  >
                    Una recaída no es el final
                  </AppText>

                  <AppText
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                  >
                    Habías logrado completar tu plan — eso demuestra tu fuerza.
                    ¿Querés empezar un nuevo plan?
                  </AppText>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowSpeedPicker(true);
                      }}
                      style={[
                        styles.primaryButton,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Ionicons name="refresh" size={18} color="#fff" />
                      <AppText
                        weight="semibold"
                        style={styles.primaryButtonText}
                      >
                        Nuevo plan
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={onDismiss}
                      style={[
                        styles.outlineButton,
                        { borderColor: colors.primary },
                      ]}
                    >
                      <AppText
                        weight="semibold"
                        style={[
                          styles.outlineButtonText,
                          { color: colors.primary },
                        ]}
                      >
                        Ahora no
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // ─── Step 2: Speed picker ───
                <>
                  <View style={styles.speedPickerHeader}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowSpeedPicker(false);
                        setSelectedSpeed(null);
                      }}
                      style={styles.backButton}
                    >
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color={colors.text}
                      />
                    </TouchableOpacity>

                    <AppText
                      weight="bold"
                      style={[styles.speedPickerTitle, { color: colors.text }]}
                    >
                      Escogé tu nuevo plan
                    </AppText>
                  </View>

                  <ScrollView
                    style={styles.speedList}
                    showsVerticalScrollIndicator={false}
                  >
                    {SPEED_OPTIONS.map((opt) => (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          setSelectedSpeed(opt.id);
                        }}
                        activeOpacity={0.8}
                        style={[
                          styles.speedOption,
                          {
                            backgroundColor: colors.secondaryBackground,
                            borderColor: colors.cardBorder,
                          },
                          selectedSpeed === opt.id && {
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.primary,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.speedBadge,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <AppText
                            weight="extrabold"
                            style={styles.speedBadgeText}
                          >
                            {opt.title}
                          </AppText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity
                    onPress={handleConfirmNewPlan}
                    disabled={!selectedSpeed}
                    activeOpacity={0.7}
                    style={[
                      styles.confirmButton,
                      { backgroundColor: colors.primary },
                      !selectedSpeed && styles.disabledButton,
                    ]}
                  >
                    <AppText weight="bold" style={styles.confirmButtonText}>
                      Empezar nuevo plan
                    </AppText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    position: "relative",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  outlineButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  outlineButtonText: {
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.4,
  },
  speedPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    gap: 10,
  },
  backButton: {
    padding: 4,
  },
  speedPickerTitle: {
    fontSize: 20,
    flex: 1,
  },
  speedList: {
    width: "100%",
    maxHeight: 300,
    marginBottom: 16,
  },
  speedOption: {
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  speedBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  speedBadgeText: {
    fontSize: 13,
    color: "#fff",
  },
  confirmButton: {
    width: "100%",
    height: 55,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 20,
    color: "#fff",
  },
});
