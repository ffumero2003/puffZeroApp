// src/components/app/settings/VerificationStatus.tsx
// Componente que muestra el estado de verificación en Settings

import AppText from "@/src/components/AppText";
import {
  formatCountdown,
  useVerificationStatus,
} from "@/src/hooks/useVerificationStatus";
import { useThemeColors } from "@/src/providers/theme-provider";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export function VerificationStatus() {
  const {
    isVerified,
    checking,
    canCheckToday,
    loading,
    countdownMs,
    checkVerification,
  } = useVerificationStatus();
  const colors = useThemeColors();
  if (loading) {
    return (
      <View style={styles.container}>
        <AppText style={styles.label}>Verificación</AppText>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <AppText style={[styles.label, { color: colors.text }]}>
        Verificación
      </AppText>

      {isVerified ? (
        // Estado: Verificado
        <View
          style={[styles.verifiedBadge, { backgroundColor: colors.secondary }]}
        >
          <AppText style={[styles.verifiedText, { color: colors.text }]}>
            ✅ Verificado
          </AppText>
        </View>
      ) : (
        // Estado: No verificado
        <TouchableOpacity
          onPress={checkVerification}
          disabled={!canCheckToday || checking}
          style={[
            styles.verifyButton,
            { backgroundColor: colors.primary },
            (!canCheckToday || checking) && styles.verifyButtonDisabled,
            {
              backgroundColor: colors.switchTrackOff,
              borderColor: colors.border,
            },
          ]}
        >
          {checking ? (
            <ActivityIndicator size="small" color={colors.textWhite} />
          ) : (
            <AppText
              style={[styles.verifyButtonText, { color: colors.textWhite }]}
            >
              {canCheckToday ? "Verificar" : formatCountdown(countdownMs)}
            </AppText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,

    borderRadius: 12,
  },
  label: {
    fontSize: 16,
  },
  verifiedBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: "600",
  },
  verifyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  verifyButtonDisabled: {
    width: "30%",
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
