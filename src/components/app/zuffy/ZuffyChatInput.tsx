// src/components/app/zuffy/ZuffyChatInput.tsx
// This component handles the text input and send button for the chat
// It includes the remaining messages counter and disables when limit is reached

import { Colors } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
  // remainingMessages: number;
  // maxMessages: number;
};

export default function ZuffyChatInput({
  onSend,
  isLoading,
  disabled,
}: // remainingMessages,
// maxMessages,
Props) {
  // Local state for the text input
  const [inputText, setInputText] = useState("");

  // Handle send button press
  const handleSend = () => {
    if (inputText.trim() && !isLoading && !disabled) {
      onSend(inputText);
      setInputText(""); // Clear input after sending
    }
  };

  // Determine if send button should be disabled
  const isSendDisabled = !inputText.trim() || isLoading || disabled;

  return (
    <View style={styles.container}>
      {/* Message counter - shows how many messages the user has left today
      <View style={styles.counterContainer}>
        <AppText style={styles.counterText}>
          {disabled
            ? "Has alcanzado el límite de mensajes por hoy"
            : `${remainingMessages} de ${maxMessages} mensajes restantes hoy`}
        </AppText>
      </View> */}

      {/* Input row with text field and send button */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          placeholder={
            disabled
              ? "Vuelve mañana para más mensajes 💙"
              : "Escribe tu mensaje..."
          }
          placeholderTextColor={Colors.light.textMuted}
          value={inputText}
          onChangeText={setInputText}
          editable={!disabled && !isLoading}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          multiline
          maxLength={500} // Prevent extremely long messages
          // Allow sending with keyboard "return" on single line
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        {/* Send button - shows loading spinner when processing */}
        <Pressable
          style={[
            styles.sendButton,
            isSendDisabled && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={isSendDisabled}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.light.textWhite} />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={
                isSendDisabled ? Colors.light.textMuted : Colors.light.textWhite
              }
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 50,
    backgroundColor: Colors.light.background,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center", // Changed to center - vertically centers input and button
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputDisabled: {
    backgroundColor: Colors.light.secondary,
    opacity: 0.7,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.secondary,
  },
});
