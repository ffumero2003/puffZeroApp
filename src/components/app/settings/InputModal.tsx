// src/components/app/settings/InputModal.tsx
// Modal with text input for editing numeric values
// Supports validation with error messages

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  title: string;
  initialValue: number;
  placeholder?: string;
  // Validation props
  validate?: (value: number) => boolean;
  errorMessage?: string;
  minValueHint?: string; // e.g., "Mínimo: 10,000"
}

export default function InputModal({
  visible,
  onClose,
  onSave,
  title,
  initialValue,
  placeholder = "0",
  validate,
  errorMessage = "Valor inválido",
  minValueHint,
}: InputModalProps) {
  const [tempValue, setTempValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset temp value and error when modal opens
  useEffect(() => {
    if (visible) {
      setTempValue(initialValue.toString());
      setError(null);
    }
  }, [visible, initialValue]);

  // Validate on change (clear error when typing)
  const handleChange = (text: string) => {
    setTempValue(text);
    setError(null); // Clear error while typing
  };

  const handleSave = () => {
    const value = parseInt(tempValue, 10);

    // Check if it's a valid number
    if (isNaN(value) || value < 0) {
      setError("Ingresa un número válido");
      return;
    }

    // Run custom validation if provided
    if (validate && !validate(value)) {
      setError(errorMessage);
      return;
    }

    // All good, save and close
    onSave(value);
    onClose();
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
            {title}
          </AppText>

          {/* Hint text (e.g., minimum value) */}
          {minValueHint && (
            <AppText style={styles.hint}>{minValueHint}</AppText>
          )}

          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={tempValue}
            onChangeText={handleChange}
            keyboardType="number-pad"
            placeholder={placeholder}
            placeholderTextColor={Colors.light.textMuted}
            autoFocus
          />

          {/* Error message */}
          {error && <AppText style={styles.errorText}>{error}</AppText>}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <AppText weight="medium" style={styles.cancelText}>
                Cancelar
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <AppText weight="bold" style={styles.saveText}>
                Guardar
              </AppText>
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
  hint: {
    fontSize: 14,
    color: Colors.light.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginTop: 16,
    color: Colors.light.text,
    textAlign: "center",
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
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
  },
});
