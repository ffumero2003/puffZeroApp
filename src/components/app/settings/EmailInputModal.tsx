// src/components/app/settings/EmailInputModal.tsx
// Modal for editing email address with validation

import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EmailInputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (email: string) => Promise<{ success: boolean; error?: string }>;
  initialValue: string;
}

export default function EmailInputModal({
  visible,
  onClose,
  onSave,
  initialValue,
}: EmailInputModalProps) {
  const colors = useThemeColors();
  const [tempValue, setTempValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setTempValue(initialValue);
      setError(null);
      setSuccess(false);
    }
  }, [visible, initialValue]);

  // Clear error while typing
  const handleChange = (text: string) => {
    setTempValue(text);
    setError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    // Basic validation
    if (!tempValue.trim()) {
      setError("Ingresa un correo");
      return;
    }

    setSaving(true);
    setError(null);

    const result = await onSave(tempValue.trim());

    setSaving(false);

    if (result.success) {
      setSuccess(true);
      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.error || "Error al actualizar");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent close when pressing modal content */}
        <Pressable style={[styles.content, { backgroundColor: colors.card }]}>
          <AppText weight="bold" style={[styles.title, { color: colors.text }]}>
            Cambiar Correo
          </AppText>

          <TextInput
            style={[
              styles.input,
              error && styles.inputError,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={tempValue}
            onChangeText={handleChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={colors.textMuted}
            autoFocus
            editable={!saving && !success}
          />

          {/* Error message */}
          {error && (
            <AppText style={[styles.errorText, { color: colors.danger }]}>
              {error}
            </AppText>
          )}

          {/* Success message */}
          {success && (
            <AppText style={[styles.successText, { color: colors.success }]}>
              ✅ Se envió un correo de confirmación a tu nueva dirección
            </AppText>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.card }]}
              onPress={onClose}
              disabled={saving}
            >
              <AppText
                weight="medium"
                style={[styles.cancelText, { color: colors.text }]}
              >
                Cancelar
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (saving || success) && styles.saveButtonDisabled,
                { backgroundColor: colors.primary, borderColor: colors.border },
              ]}
              onPress={handleSave}
              disabled={saving || success}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.textWhite} />
              ) : (
                <AppText
                  weight="bold"
                  style={[styles.saveText, { color: colors.textWhite }]}
                >
                  Guardar
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  title: {
    fontSize: 18,

    textAlign: "center",
  },
  input: {
    borderWidth: 2,

    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginTop: 16,
  },
  inputError: {},
  errorText: {
    fontSize: 14,

    textAlign: "center",
    marginTop: 8,
  },
  successText: {
    fontSize: 14,

    textAlign: "center",
    marginTop: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    fontSize: 16,
  },
});
