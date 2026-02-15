// src/hooks/usePendingVerification.ts
// Unified hook for both account verification and email change verification

import { supabase } from "@/src/lib/supabase";
import {
  cancelVerificationReminder
} from "@/src/services/notifications/verification-notification";
import {
  clearPendingVerification,
  getDaysRemainingForVerification,
  getDaysSinceVerificationRequest,
  getPendingVerification,
  isVerificationExpired,
  isVerificationMandatory,
  PendingVerification,
  VerificationType,
} from "@/src/services/verification/verification-service";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_MODAL_SHOWN_KEY = "verification_modal_last_shown";


export function usePendingVerification() {
  const [pending, setPending] = useState<PendingVerification | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Check for pending verification on mount
  const checkPendingVerification = useCallback(async () => {
    setLoading(true);
    try {
      const pendingData = await getPendingVerification();

      if (!pendingData) {
        setPending(null);
        setShowModal(false);
        setLoading(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Check if verified based on type
      if (pendingData.type === "email_change") {
        // Email change: verified when current email matches new email
        if (user?.email === pendingData.email) {
          await clearPendingVerification();
          await cancelVerificationReminder();
          setPending(null);
          setShowModal(false);
          console.log("✅ Email change verified successfully");
          setLoading(false);
          return;
        }
      } else if (pendingData.type === "account") {
        // Account verification: si no hay pending, está verificado
        // El pending se borra cuando el usuario clickea el link (verify-email.tsx)
        // No hacemos nada aquí - si hay pending, el usuario no verificó
      }

      // Check if expired (only for email change - account blocks app instead)
      if (pendingData.type === "email_change" && isVerificationExpired(pendingData)) {
        await clearPendingVerification();
        await cancelVerificationReminder();

        setPending(null);
        setShowModal(false);
        console.log("⏰ Email change expired");
        setLoading(false);
        return;
      }

      // Still pending - show modal
      setPending(pendingData);
      setShowModal(true);
    } catch (error) {
      console.error("Error checking pending verification:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run check when screen comes into focus (not just on mount)
  useFocusEffect(
    useCallback(() => {
      const checkWithDailyLimit = async () => {
        const pendingData = await getPendingVerification();
        
        // If no pending verification, nothing to show
        if (!pendingData) {
          setPending(null);
          setShowModal(false);
          setLoading(false);
          return;
        }

        // Check if mandatory (day 7+) - always show if mandatory
        if (isVerificationMandatory(pendingData)) {
          checkPendingVerification();
          return;
        }

        // Check if we already showed the modal today
        const lastShown = await AsyncStorage.getItem(LAST_MODAL_SHOWN_KEY);
        const today = new Date().toDateString();

        if (lastShown === today) {
          // Already showed today - just update state without showing modal
          setPending(pendingData);
          setShowModal(false);
          setLoading(false);
          return;
        }

        // First time today - show modal and save date
        await AsyncStorage.setItem(LAST_MODAL_SHOWN_KEY, today);
        checkPendingVerification();
      };

      checkWithDailyLimit();
    }, [checkPendingVerification])
  );



  // Dismiss modal (only works if not mandatory)
  const dismissModal = useCallback(() => {
    if (pending && isVerificationMandatory(pending)) {
      // Can't dismiss if mandatory
      return;
    }
    setShowModal(false);
  }, [pending]);

  // Computed values
  const daysSinceRequest = pending ? getDaysSinceVerificationRequest(pending) : 0;
  const daysRemaining = pending ? getDaysRemainingForVerification(pending) : 7;
  const isMandatory = pending ? isVerificationMandatory(pending) : false;
  const verificationType: VerificationType | null = pending?.type ?? null;

  return {
    pending,
    showModal,
    loading,
    daysSinceRequest,
    daysRemaining,
    isMandatory,
    verificationType,
    dismissModal,
    recheckStatus: checkPendingVerification,
  };
}
