// app/(app)/home.tsx
import AppText from "@/src/components/AppText";
import DayDetailModal from "@/src/components/app/home/DayDetailModal";
import HomeHeader from "@/src/components/app/home/HomeHeader";
import ProgressCircle from "@/src/components/app/home/ProgressCircle";
import WeekDayCircle from "@/src/components/app/home/WeekDayCircle";
import { usePendingVerification } from "@/src/hooks/usePendingVerification";
// COMMENTED OUT: Invalid direct imports - these are returned by the hook, not exported
// import { currentWeek, canGoBack, canGoForward, goToPreviousWeek, goToNextWeek } from "@/src/viewmodels/app/useHomeViewModel";
import { VerificationModal } from "@/src/components/app/VerificationModal";
import { Colors } from "@/src/constants/theme";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import {
  resendEmailChangeVerification,
  sendVerificationEmail,
} from "@/src/services/auth-services";
import { useHomeViewModel } from "@/src/viewmodels/app/useHomeViewModel";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const {
    firstName,
    dailyGoal,
    todayPuffs,
    percentage,
    timeSinceLastPuff,
    motivationalMessage,
    currentWeek,
    // COMMENTED OUT: Week navigation - kept for potential future use
    // canGoBack,
    // canGoForward,
    addPuff,
    // goToPreviousWeek,
    // goToNextWeek,
    loading,
  } = useHomeViewModel();

  const {
    pending,
    showModal,
    daysRemaining,
    isMandatory,
    verificationType,
    dismissModal,
    recheckStatus,
  } = usePendingVerification();

  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const { user } = useAuth();
  const hasShownVerificationAlert = useRef(false);

  // Show verification reminder when entering Home (only if unverified)
  useEffect(() => {
    if (
      user &&
      !user.email_confirmed_at &&
      !hasShownVerificationAlert.current
    ) {
      hasShownVerificationAlert.current = true;
      Alert.alert(
        "Verificá tu cuenta",
        "Te enviamos un email de verificación. Revisá tu bandeja de entrada para no perder tu progreso.",
        [{ text: "OK" }]
      );
    }
  }, [user]);

  const handleResendEmail = async () => {
    if (!pending) return;

    setResending(true);

    try {
      let result;

      if (pending.type === "email_change") {
        // Email change: use Supabase's built-in resend
        result = await resendEmailChangeVerification(pending.email);
      } else {
        // Account verification: use our custom Edge Function
        result = await sendVerificationEmail(pending.email);
      }

      if (result.error) {
        Alert.alert("Error", result.error.message);
      } else {
        Alert.alert(
          "Email enviado",
          "Revisá tu bandeja de entrada y carpeta de spam."
        );
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el email");
    } finally {
      setResending(false);
    }
  };

  // Handle "Ya verifiqué" button
  const handleCheckVerification = async () => {
    setChecking(true);

    try {
      // Force refresh the session to get updated user data
      const { error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        console.error("Error refreshing session:", refreshError);
      }

      // Get the updated user
      const {
        data: { user: updatedUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        Alert.alert("Error", "No se pudo verificar tu estado");
        return;
      }

      console.log("Updated user email:", updatedUser?.email);

      // Re-run the verification check
      await recheckStatus();
    } catch (error) {
      Alert.alert("Error", "No se pudo verificar tu estado");
    } finally {
      setChecking(false);
    }
  };

  // Show loading spinner until profile, puff count, and quote are all ready
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}> */}
        <HomeHeader firstName={firstName} dailyGoal={dailyGoal} />

        {/* </View> */}

        <View style={[styles.scrollView, styles.content]}>
          {/* Week selector - current week only */}
          {currentWeek && (
            <View style={styles.daysRow}>
              {currentWeek.days.map((day, index) => (
                <WeekDayCircle
                  key={index}
                  day={day.day}
                  puffs={day.puffs}
                  isToday={day.isToday}
                  isActive={day.isToday}
                  onPress={() => setSelectedDay(day)}
                />
              ))}
            </View>
          )}
          {showModal && pending && verificationType && (
            <VerificationModal
              visible={showModal}
              type={verificationType}
              email={pending.email}
              daysRemaining={daysRemaining}
              isMandatory={isMandatory}
              onClose={dismissModal}
              onResendEmail={handleResendEmail}
              onCheckVerification={handleCheckVerification}
              resending={resending}
              checking={checking}
            />
          )}

          <View style={styles.quoteContainer}>
            <AppText
              style={[styles.quote, { transform: [{ skewX: "-10deg" }] }]}
              weight="bold"
            >
              {motivationalMessage}
            </AppText>
          </View>

          {/* Progress Circle */}
          <ProgressCircle
            percentage={percentage}
            currentPuffs={todayPuffs}
            totalPuffs={dailyGoal}
            lastPuffTime={timeSinceLastPuff}
          />

          {/* Add Puff Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={addPuff}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={60} color={Colors.light.textWhite} />
            <AppText weight="bold" style={styles.addButtonText}>
              Agregar Puffs
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Day Detail Modal */}
        {selectedDay && (
          <DayDetailModal
            visible={!!selectedDay}
            day={selectedDay.day}
            date={new Date(selectedDay.date).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            puffs={selectedDay.puffs}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },

  // weekContainer: {
  //   marginBottom: 0,
  // },
  // weekHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 16,
  // },
  // weekLabel: {
  //   fontSize: 14,
  //   color: Colors.light.text,
  // },
  // arrowButton: {
  //   padding: 8,
  // },
  // arrowButtonDisabled: {
  //   opacity: 0.3,
  // },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    paddingVertical: 6,
  },
  quoteContainer: {
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  quote: {
    fontSize: 18,
    textAlign: "center",
    fontStyle: "italic",
    color: Colors.light.text,
    lineHeight: 26,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: Colors.light.textWhite,
  },
});
