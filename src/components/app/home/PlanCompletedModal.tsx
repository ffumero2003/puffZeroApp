// src/components/app/home/PlanCompletedModal.tsx
// Modal that appears when the user's goal countdown timer reaches 0.
// Shows a success view (if avg puffs in last 3 days ≈ 0) or a retry view.

import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

let StoreReview: typeof import("expo-store-review") | null = null;
try {
  StoreReview = require("expo-store-review");
} catch {
  // Not available (e.g., Expo Go) — will use fallback URL
}

// Same speed options from onboarding, reused here for the "new plan" picker
const SPEED_OPTIONS = [
  { id: "14", title: "14 DÍAS — SPRINT RÁPIDO  ⚡" },
  { id: "21", title: "21 DÍAS — NUEVO HÁBITO  💪" },
  { id: "30", title: "30 DÍAS — REINICIO COMPLETO  ✨" },
  { id: "60", title: "2 MESES — CAMINO ESTABLE  🚀" },
  { id: "90", title: "3 MESES — CAMBIO COMPLETO  ♻️" },
];

interface PlanCompletedModalProps {
  visible: boolean;
  // true = user had ~0 puffs in last 3 days (success), false = still vaping
  isSuccess: boolean;
  onDismiss: () => void;
  // Called when user picks a new speed (retry flow)
  onSelectNewPlan: (newGoalSpeed: string) => void;
}

// ─── Simple confetti piece using Animated API ───
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CONFETTI_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#FF9FF3",
  "#54A0FF",
];
const CONFETTI_COUNT = 40;

function ConfettiPiece({ delay, color }: { delay: number; color: string }) {
  const fallAnim = useRef(new Animated.Value(-20)).current;
  const horizontalAnim = useRef(
    new Animated.Value(Math.random() * SCREEN_WIDTH)
  ).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startX = Math.random() * SCREEN_WIDTH;
    horizontalAnim.setValue(startX);

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        // Fall down
        Animated.timing(fallAnim, {
          toValue: SCREEN_HEIGHT + 20,
          duration: 2500 + Math.random() * 1500,
          useNativeDriver: true,
        }),
        // Sway left/right
        Animated.sequence([
          Animated.timing(horizontalAnim, {
            toValue: startX + (Math.random() * 80 - 40),
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(horizontalAnim, {
            toValue: startX - (Math.random() * 80 - 40),
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(horizontalAnim, {
            toValue: startX + (Math.random() * 60 - 30),
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Rotate
        Animated.timing(rotateAnim, {
          toValue: Math.random() * 10,
          duration: 3000,
          useNativeDriver: true,
        }),
        // Fade out near the bottom
        Animated.sequence([
          Animated.delay(2000),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 10],
    outputRange: ["0deg", "3600deg"],
  });

  // Randomly pick between a square and a rectangle for variety
  const isWide = Math.random() > 0.5;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        width: isWide ? 12 : 8,
        height: isWide ? 6 : 10,
        borderRadius: 2,
        backgroundColor: color,
        opacity: opacityAnim,
        transform: [
          { translateY: fallAnim },
          { translateX: horizontalAnim },
          { rotate: spin },
        ],
      }}
    />
  );
}

function Confetti() {
  const pieces = useRef(
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      delay: Math.random() * 800, // staggered start
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} color={piece.color} />
      ))}
    </View>
  );
}

export default function PlanCompletedModal({
  visible,
  isSuccess,
  onDismiss,
  onSelectNewPlan,
}: PlanCompletedModalProps) {
  const colors = useThemeColors();
  // Track whether we're showing the speed picker (retry flow step 2)
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  // Track which speed option is selected
  const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null);

  // REPLACE the existing handleRateApp with this:
  const handleRateApp = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      // Try the native in-app review dialog first (only works in production builds)
      if (StoreReview && (await StoreReview.hasAction())) {
        await StoreReview.requestReview();
        onDismiss();
        return;
      }
    } catch {
      // Fall through to URL fallback
    }
    // Fallback: open the App Store / Play Store page directly
    // TODO: Replace these URLs with your actual store URLs
    const storeUrl = Platform.select({
      ios: "https://apps.apple.com/app/idXXXXXXXXXX",
      android: "https://play.google.com/store/apps/details?id=com.yourapp.id",
    });
    if (storeUrl) Linking.openURL(storeUrl);
    onDismiss();
  };

  // Handle confirming new plan selection
  const handleConfirmNewPlan = () => {
    if (!selectedSpeed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSelectNewPlan(selectedSpeed);
    // Reset local state for next time modal opens
    setShowSpeedPicker(false);
    setSelectedSpeed(null);
  };

  // ─── SUCCESS VIEW: User quit successfully ───
  // ─── SUCCESS VIEW: User quit successfully ───
  if (isSuccess) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback>
          <View style={styles.overlay}>
            {/* Confetti falls over the entire screen */}
            <Confetti />
            <TouchableWithoutFeedback>
              <View style={[styles.modal, { backgroundColor: colors.card }]}>
                {/* Celebration icon */}
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: colors.success + "20" },
                  ]}
                >
                  <AppText style={styles.iconEmoji}>🎉</AppText>
                </View>

                {/* Title */}
                <AppText
                  weight="bold"
                  style={[styles.title, { color: colors.text }]}
                >
                  ¡Lo lograste!
                </AppText>

                {/* Subtitle */}
                <AppText
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  Completaste tu plan y llevas días sin vapear. Estamos muy
                  orgullosos de ti.
                </AppText>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  {/* Rate the app button */}
                  <TouchableOpacity
                    onPress={handleRateApp}
                    style={[
                      styles.primaryButton,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name="star" size={18} color="#fff" />
                    <AppText weight="semibold" style={styles.primaryButtonText}>
                      Califica la app
                    </AppText>
                  </TouchableOpacity>

                  {/* Continue / dismiss button */}
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
                      Seguir así
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  // ─── RETRY VIEW: User still vaping ───
  // Step 1: Ask what they want to do
  // Step 2: Show speed picker if they chose "Nuevo plan"
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modal, { backgroundColor: colors.card }]}>
              {!showSpeedPicker ? (
                // ─── Step 1: Ask the user ───
                <>
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: colors.primary + "20" },
                    ]}
                  >
                    <AppText style={styles.iconEmoji}>💪</AppText>
                  </View>

                  {/* Title */}
                  <AppText
                    weight="bold"
                    style={[styles.title, { color: colors.text }]}
                  >
                    Tu plan terminó
                  </AppText>

                  {/* Subtitle */}
                  <AppText
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                  >
                    No te preocupes — dejar el vape es un proceso. ¿Listo para
                    otro intento? Si no, te preguntaremos de nuevo en 3 días.
                  </AppText>

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    {/* New plan button */}
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

                    {/* Take a break / dismiss button */}
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
                        Necesito un descanso
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // ─── Step 2: Speed picker ───
                <>
                  {/* Header row: back arrow + title on same line */}
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

                  {/* Speed options list — onboarding card style */}
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
                          // Highlight selected — matches onboarding card selected style
                          selectedSpeed === opt.id && {
                            backgroundColor: colors.inputBackground,
                            borderColor: colors.primary,
                          },
                        ]}
                      >
                        {/* Badge with title — same as OnboardingOptionCard */}
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

                  {/* Confirm button — onboarding button style */}
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
  // ─── Speed picker header: arrow + title on same row ───
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
  // ─── Onboarding-style card for each speed option ───
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
  // ─── Confirm button — matches onboarding ContinueButton style ───
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
