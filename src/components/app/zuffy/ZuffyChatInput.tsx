// src/components/app/zuffy/ZuffyChatInput.tsx
import { useThemeColors } from "@/src/providers/theme-provider";
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
};

export default function ZuffyChatInput({ onSend, isLoading, disabled }: Props) {
  const [inputText, setInputText] = useState("");
  const colors = useThemeColors();

  const handleSend = () => {
    if (inputText.trim() && !isLoading && !disabled) {
      onSend(inputText);
      setInputText("");
    }
  };

  const isSendDisabled = !inputText.trim() || isLoading || disabled;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.inputRow, { backgroundColor: colors.background }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.secondaryBackground,
              color: colors.text,
              borderColor: colors.border,
            },
            disabled && { backgroundColor: colors.secondary, opacity: 0.7 },
          ]}
          placeholder={
            disabled
              ? "Vuelve mañana para más mensajes 💙"
              : "Escribe tu mensaje..."
          }
          placeholderTextColor={colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          editable={!disabled && !isLoading}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        <Pressable
          style={[
            styles.sendButton,
            {
              backgroundColor: isSendDisabled
                ? colors.secondary
                : colors.primary,
            },
          ]}
          onPress={handleSend}
          disabled={isSendDisabled}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.textWhite} />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={isSendDisabled ? colors.textMuted : colors.textWhite}
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
    paddingTop: 10,
    paddingBottom: 4,
    borderRadius: 50,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
