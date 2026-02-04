// src/components/app/settings/EmailInputModal.tsx
// Modal for editing email address with validation

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
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
        <Pressable style={styles.content}>
          <AppText weight="bold" style={styles.title}>
            Cambiar Correo
          </AppText>

          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={tempValue}
            onChangeText={handleChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={Colors.light.textMuted}
            autoFocus
            editable={!saving && !success}
          />

          {/* Error message */}
          {error && <AppText style={styles.errorText}>{error}</AppText>}

          {/* Success message */}
          {success && (
            <AppText style={styles.successText}>
              ✅ Se envió un correo de confirmación a tu nueva dirección
            </AppText>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={saving}
            >
              <AppText weight="medium" style={styles.cancelText}>
                Cancelar
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (saving || success) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving || success}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <AppText weight="bold" style={styles.saveText}>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 340,
  },
  title: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginTop: 16,
    color: Colors.light.text,
  },
  inputError: {
    borderColor: Colors.light.danger,
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.danger,
    textAlign: "center",
    marginTop: 8,
  },
  successText: {
    fontSize: 14,
    color: Colors.light.success,
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
    color: Colors.light.textMuted,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
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
    color: "#fff",
  },
});
