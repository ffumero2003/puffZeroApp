// src/components/app/zuffy/ZuffyChatBubble.tsx
// This component renders a single chat message bubble
// It handles both user messages (right-aligned) and Zuffy's messages (left-aligned)

import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { ChatMessage } from "@/src/services/zuffy-ai-service";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  message: ChatMessage;
};

export default function ZuffyChatBubble({ message }: Props) {
  const colors = useThemeColors();
  // Determine if this is a user message or Zuffy's response
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.secondary, borderBottomLeftRadius: 4 },
        ]}
      >
        <AppText
          style={[
            styles.messageText,
            { color: isUser ? colors.textWhite : colors.text },
          ]}
        >
          {message.content}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
