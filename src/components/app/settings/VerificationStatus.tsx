// src/components/app/settings/VerificationStatus.tsx
// Componente que muestra el estado de verificación en Settings

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import {
  formatCountdown,
  useVerificationStatus,
} from "@/src/hooks/useVerificationStatus";
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

  if (loading) {
    return (
      <View style={styles.container}>
        <AppText style={styles.label}>Verificación</AppText>
        <ActivityIndicator size="small" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>Verificación</AppText>

      {isVerified ? (
        // Estado: Verificado
        <View style={styles.verifiedBadge}>
          <AppText style={styles.verifiedText}>✅ Verificado</AppText>
        </View>
      ) : (
        // Estado: No verificado
        <TouchableOpacity
          onPress={checkVerification}
          disabled={!canCheckToday || checking}
          style={[
            styles.verifyButton,
            (!canCheckToday || checking) && styles.verifyButtonDisabled,
          ]}
        >
          {checking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <AppText style={styles.verifyButtonText}>
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
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifiedText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: "#B0B0B0",
    width: "30%",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
