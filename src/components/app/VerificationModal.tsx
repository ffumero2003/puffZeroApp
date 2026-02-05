// src/components/app/VerificationModal.tsx
// Unified modal for both account verification and email change verification

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { VerificationType } from "@/src/services/verification/verification-service";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface VerificationModalProps {
  visible: boolean;
  type: VerificationType;
  email: string;
  daysRemaining: number;
  isMandatory: boolean;
  onClose: () => void;
  onResendEmail: () => void;
  onCheckVerification: () => void; // NEW
  resending?: boolean;
  checking?: boolean; // NEW
}

export function VerificationModal({
  visible,
  type,
  email,
  daysRemaining,
  isMandatory,
  onCheckVerification,
  checking = false,
  onClose,
  onResendEmail,
  resending = false,
}: VerificationModalProps) {
  const isUrgent = daysRemaining <= 2;
  const isEmailChange = type === "email_change";

  // Text based on verification type
  const title = isEmailChange
    ? "Verificá tu nuevo email"
    : "Verificá tu cuenta";
  const subtitle = isEmailChange
    ? "Enviamos un link de verificación a:"
    : "Enviamos un link de verificación a tu email:";

  const handleOverlayPress = () => {
    if (!isMandatory) {
      onClose();
    }
  };

  const handleResend = () => {
    onResendEmail();
    // Don't close modal - let parent handle it after success
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isMandatory ? undefined : onClose}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modal,
                isUrgent && styles.urgentModal,
                isMandatory && styles.mandatoryModal,
              ]}
            >
              {/* Close button - only show if NOT mandatory */}
              {!isMandatory && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              )}

              {/* Icon */}
              <View
                style={[
                  styles.iconCircle,
                  isUrgent && styles.urgentIconCircle,
                  isMandatory && styles.mandatoryIconCircle,
                ]}
              >
                <Ionicons
                  name={isMandatory ? "warning-outline" : "mail-unread-outline"}
                  size={32}
                  color={
                    isMandatory
                      ? "#DC3545"
                      : isUrgent
                      ? "#856404"
                      : Colors.light.primary
                  }
                />
              </View>

              {/* Title */}
              <AppText
                weight="bold"
                style={[styles.title, isMandatory && styles.mandatoryTitle]}
              >
                {isMandatory ? "¡Verificación requerida!" : title}
              </AppText>

              {/* Subtitle */}
              <AppText style={styles.subtitle}>
                {isMandatory
                  ? "Debés verificar tu email para continuar usando la app:"
                  : subtitle}
              </AppText>

              <AppText weight="semibold" style={styles.email}>
                {email}
              </AppText>

              {/* Expiry info - show different message when mandatory */}
              {isMandatory ? (
                <View style={styles.mandatoryBadge}>
                  <Ionicons name="alert-circle" size={14} color="#DC3545" />
                  <AppText style={styles.mandatoryBadgeText}>
                    {isEmailChange
                      ? "El cambio de email expira hoy"
                      : "Tu cuenta será bloqueada"}
                  </AppText>
                </View>
              ) : daysRemaining > 0 ? (
                <View
                  style={[styles.expiryBadge, isUrgent && styles.urgentBadge]}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={isUrgent ? "#856404" : "#666"}
                  />
                  <AppText
                    style={[styles.expiryText, isUrgent && styles.urgentText]}
                  >
                    Expira en {daysRemaining}{" "}
                    {daysRemaining === 1 ? "día" : "días"}
                  </AppText>
                </View>
              ) : null}

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {/* Resend button - always show, primary when mandatory */}
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resending}
                  style={[
                    isMandatory ? styles.primaryButton : styles.resendButton,
                    resending && styles.disabledButton,
                  ]}
                >
                  {resending ? (
                    <ActivityIndicator
                      size="small"
                      color={isMandatory ? "#fff" : Colors.light.primary}
                    />
                  ) : (
                    <>
                      <Ionicons
                        name="refresh-outline"
                        size={18}
                        color={isMandatory ? "#fff" : Colors.light.primary}
                      />
                      <AppText
                        weight="semibold"
                        style={
                          isMandatory
                            ? styles.primaryButtonText
                            : styles.resendText
                        }
                      >
                        Reenviar email
                      </AppText>
                    </>
                  )}
                </TouchableOpacity>

                {/* Entendido button - only show if NOT mandatory */}
                {!isMandatory && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.dismissButton}
                  >
                    <AppText weight="medium" style={styles.dismissText}>
                      Entendido
                    </AppText>
                  </TouchableOpacity>
                )}

                {/* Ya verifiqué button */}
                <TouchableOpacity
                  onPress={onCheckVerification}
                  disabled={checking}
                  style={styles.checkButton}
                >
                  {checking ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : (
                    <AppText weight="medium" style={styles.checkButtonText}>
                      Ya verifiqué mi cuenta
                    </AppText>
                  )}
                </TouchableOpacity>
              </View>

              {/* Help text when mandatory */}
              {isMandatory && (
                <AppText style={styles.helpText}>
                  ¿No recibiste el email? Revisá tu carpeta de spam.
                </AppText>
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    position: "relative",
  },
  urgentModal: {
    borderWidth: 2,
    borderColor: "#FFC107",
  },
  mandatoryModal: {
    borderWidth: 2,
    borderColor: "#DC3545",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  urgentIconCircle: {
    backgroundColor: "#FFF3CD",
  },
  mandatoryIconCircle: {
    backgroundColor: "#F8D7DA",
  },
  title: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  mandatoryTitle: {
    color: "#DC3545",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
  },
  expiryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  urgentBadge: {
    backgroundColor: "#FFF3CD",
  },
  mandatoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8D7DA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  mandatoryBadgeText: {
    fontSize: 12,
    color: "#DC3545",
  },
  expiryText: {
    fontSize: 12,
    color: "#666",
  },
  urgentText: {
    color: "#856404",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
  },
  resendText: {
    color: Colors.light.primary,
    fontSize: 15,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  dismissButton: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
  dismissText: {
    color: "#fff",
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  helpText: {
    fontSize: 12,
    color: "#888",
    marginTop: 16,
    textAlign: "center",
  },

  checkButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
