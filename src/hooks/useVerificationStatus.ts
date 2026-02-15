// src/hooks/useVerificationStatus.ts
// Hook para manejar el estado de verificación en Settings

import { supabase } from "@/src/lib/supabase";
import { cancelVerificationReminder } from "@/src/services/notifications/verification-notification";
import {
  clearPendingVerification,
  getPendingVerification,
} from "@/src/services/verification/verification-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

const LAST_VERIFICATION_CHECK_KEY = "last_verification_check_timestamp";
const COOLDOWN_MS = 10 * 60 * 60 * 1000; // 10 horas en ms

// Calcula los ms restantes del cooldown de 10 horas
function getMsRemaining(lastCheckTimestamp: string | null): number {
  if (!lastCheckTimestamp) return 0;
  const elapsed = Date.now() - parseInt(lastCheckTimestamp, 10);
  return Math.max(0, COOLDOWN_MS - elapsed);
}


// Formatea milisegundos a "HH:MM:SS"
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function useVerificationStatus() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [canCheckToday, setCanCheckToday] = useState(true);
  const [loading, setLoading] = useState(true);
  const [countdownMs, setCountdownMs] = useState<number>(0);

  // Cargar estado inicial
  const loadVerificationState = useCallback(async () => {
    setLoading(true);
    try {
      // Verificar si hay pending verification
      const pending = await getPendingVerification();

      // Si NO hay pending → está verificado
      // Si hay pending → no está verificado
      setIsVerified(!pending);

      // Verificar si ya checkeó hoy
      const lastCheckTs = await AsyncStorage.getItem(LAST_VERIFICATION_CHECK_KEY);
      const remaining = getMsRemaining(lastCheckTs);
      const canCheck = remaining <= 0;
      setCanCheckToday(canCheck);

      if (!canCheck) {
        setCountdownMs(remaining);
      }
    } catch (error) {
      console.error("Error loading verification state:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    loadVerificationState();
  }, [loadVerificationState]);

  // Timer que actualiza cada segundo cuando no puede checkear
  useEffect(() => {
    if (canCheckToday || isVerified) return;

    const interval = setInterval(async () => {
      const lastCheckTs = await AsyncStorage.getItem(LAST_VERIFICATION_CHECK_KEY);
      const remaining = getMsRemaining(lastCheckTs);
      if (remaining <= 0) {
        setCanCheckToday(true);
        setCountdownMs(0);
        clearInterval(interval);
      } else {
        setCountdownMs(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [canCheckToday, isVerified]);

  // Función para verificar (cuando toca el botón)
  const checkVerification = useCallback(async (): Promise<boolean> => {
    setChecking(true);

    try {
      // Refrescar sesión
      await supabase.auth.refreshSession();

      // Obtener usuario actualizado
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        Alert.alert("Error", "No se pudo verificar tu estado");
        return false;
      }

      // Obtener pending verification
      const pending = await getPendingVerification();

      // Si no hay pending → ya está verificado
      if (!pending) {
        setIsVerified(true);
        Alert.alert("✅ Verificado", "Tu cuenta está verificada.");
        return true;
      }

      // Verificar según el tipo
      let verified = false;

      if (pending.type === "email_change") {
        // Email change: verificado cuando el email actual = email pendiente
        verified = user?.email === pending.email;
      } else if (pending.type === "account") {
        // Account: para account verification, el link ya debería haber
        // borrado el pending. Si llegamos aquí, no está verificado.
        verified = false;
      }

      if (verified) {
        // ✅ Verificado - limpiar pending
        await clearPendingVerification();
        await cancelVerificationReminder();
        setIsVerified(true);
        Alert.alert("✅ Verificado", "Tu cuenta está verificada.");
        return true;
      } else {
        // ❌ No verificado - marcar que ya checkeó hoy
        const now = Date.now().toString();
        await AsyncStorage.setItem(LAST_VERIFICATION_CHECK_KEY, now);
        setCanCheckToday(false);
        setCountdownMs(COOLDOWN_MS);

        Alert.alert(
          "No verificado",
          "Tu email aún no está verificado. Revisá tu bandeja de entrada."
        );
        return false;
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo verificar tu estado");
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return {
    isVerified,
    checking,
    canCheckToday,
    loading,
    countdownMs,
    checkVerification,
    refresh: loadVerificationState,
  };
}
