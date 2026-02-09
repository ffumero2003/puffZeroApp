// src/components/app/settings/SupportModal.tsx
// Modal for contacting support - sends name + message to your email

import AppText from "@/src/components/AppText";
import { SUPABASE_ANON_KEY } from "@/src/lib/supabase";
import { useThemeColors } from "@/src/providers/theme-provider";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SupportModal({ visible, onClose }: SupportModalProps) {
  const colors = useThemeColors();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Reset fields when modal opens
  useEffect(() => {
    if (visible) {
      setName("");
      setMessage("");
    }
  }, [visible]);

  const INTERNAL_SECRET = "puffzero_internal_9f3KxP2mLQa8Zx72dW0HcR";

  const handleSend = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre");
      return;
    }
    if (!message.trim()) {
      Alert.alert("Error", "Por favor escribe un mensaje");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(
        "https://ifjbatvmxeujewbrfjzg.supabase.co/functions/v1/send-support-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "x-internal-key": INTERNAL_SECRET,
          },
          body: JSON.stringify({
            from_name: name.trim(),
            message: message.trim(),
          }),
        }
      );

      if (res.ok) {
        Alert.alert(
          "Mensaje enviado",
          "Gracias por contactarnos. Te responderemos lo antes posible."
        );
        onClose();
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo enviar el mensaje. Intenta de nuevo más tarde."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? -70 : 0}
      >
        {/* Overlay - tap outside to dismiss keyboard or close modal */}
        <Pressable style={styles.overlayInner} onPress={Keyboard.dismiss}>
          {/* Prevent close when pressing modal content */}
          <Pressable style={[styles.content, { backgroundColor: colors.card }]}>
            <AppText
              weight="bold"
              style={[styles.title, { color: colors.text }]}
            >
              Contactar Soporte
            </AppText>

            <AppText style={[styles.subtitle, { color: colors.textMuted }]}>
              Escríbenos y te responderemos lo antes posible
            </AppText>

            {/* Name input */}
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              editable={!sending}
            />

            {/* Message input - multiline */}
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { color: colors.text, borderColor: colors.border },
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Describe tu problema o pregunta..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!sending}
            />

            {/* Buttons */}
            <View style={[styles.buttons, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={onClose}
                disabled={sending}
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
                  styles.sendButton,
                  sending && styles.sendButtonDisabled,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleSend}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={colors.textWhite} />
                ) : (
                  <AppText
                    weight="bold"
                    style={[styles.sendText, { color: colors.textWhite }]}
                  >
                    Enviar
                  </AppText>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // Only this one has the dark background
    justifyContent: "center",
    alignItems: "center",
  },
  overlayInner: {
    flex: 1,
    backgroundColor: "transparent", // No background so it doesn't double up
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginTop: 16,
  },
  textArea: {
    height: 120,
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
  sendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendText: {
    fontSize: 16,
  },
});
