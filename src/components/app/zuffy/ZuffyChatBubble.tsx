// src/components/app/zuffy/ZuffyChatBubble.tsx
// This component renders a single chat message bubble
// It handles both user messages (right-aligned) and Zuffy's messages (left-aligned)

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { ChatMessage } from "@/src/services/zuffy-ai-service";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  message: ChatMessage;
};

export default function ZuffyChatBubble({ message }: Props) {
  // Determine if this is a user message or Zuffy's response
  // This affects the styling and positioning of the bubble
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.container,
        // Align user messages to the right, Zuffy's to the left
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          // Different background colors for visual distinction
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <AppText
          style={[
            styles.messageText,
            // User messages get white text, Zuffy's get dark text
            isUser ? styles.userText : styles.assistantText,
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
  // User messages align to the right side of the screen
  userContainer: {
    alignItems: "flex-end",
  },
  // Zuffy's messages align to the left side
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%", // Prevent bubbles from taking full width
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  // User bubble styling - primary brand color
  userBubble: {
    backgroundColor: Colors.light.primary,
    // Rounded corners except bottom-right for user messages
    borderBottomRightRadius: 4,
  },
  // Zuffy's bubble styling - light secondary color
  assistantBubble: {
    backgroundColor: Colors.light.secondary,
    // Rounded corners except bottom-left for assistant messages
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: Colors.light.textWhite,
  },
  assistantText: {
    color: Colors.light.text,
  },
});
