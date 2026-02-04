// app/(app)/zuffy.tsx
// Main Zuffy chat screen that brings everything together
// This is the complete chat interface with header, messages, quick actions, and input

import ZuffyChatBubble from "@/src/components/app/zuffy/ZuffyChatBubble";
import ZuffyChatInput from "@/src/components/app/zuffy/ZuffyChatInput";
import ZuffyHeader from "@/src/components/app/zuffy/ZuffyHeader";
import ZuffyQuickActions from "@/src/components/app/zuffy/ZuffyQuickActions";
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { useZuffyViewModel } from "@/src/viewmodels/app/useZuffyViewModel";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function Zuffy() {
  // Get all the data and functions from the view model
  const {
    firstName,
    messages,
    isLoading,
    sendMessage,
    canSendMessage,
    isInitialized,
  } = useZuffyViewModel();

  // Ref for auto-scrolling to the bottom when new messages arrive
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Small delay to ensure the new message is rendered before scrolling
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Handle quick action button press
  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // Check if this is an empty conversation (no messages yet)
  const isEmptyChat = messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.innerContainer}>
        {/* Header with title and cloud icon */}
        <ZuffyHeader />

        {/* Main chat area - ScrollView for scrolling through messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={[
            styles.chatContent,
            isEmptyChat && styles.chatContentEmpty,
          ]}
          // "handled" allows buttons inside to work, dismisses keyboard on scroll
          keyboardShouldPersistTaps="handled"
          // Dismiss keyboard when scrolling
          onScrollBeginDrag={Keyboard.dismiss}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {isEmptyChat ? (
            // Empty state with greeting and quick actions
            // Pressable here dismisses keyboard when tapping empty area
            <Pressable style={styles.emptyState} onPress={Keyboard.dismiss}>
              <AppText weight="bold" style={styles.greeting}>
                Hola, {firstName} 👋
              </AppText>

              <ZuffyQuickActions
                onActionPress={handleQuickAction}
                disabled={!canSendMessage || isLoading}
              />
            </Pressable>
          ) : (
            // Message list when there are messages
            // Pressable wrapper allows tapping between messages to dismiss keyboard
            <Pressable onPress={Keyboard.dismiss}>
              {messages.map((message, index) => (
                <ZuffyChatBubble key={index} message={message} />
              ))}

              {/* Typing indicator when Zuffy is thinking */}
              {isLoading && (
                <View style={styles.typingIndicator}>
                  <AppText style={styles.typingText}>
                    Zuffy está escribiendo...
                  </AppText>
                </View>
              )}
            </Pressable>
          )}
        </ScrollView>

        {/* Input area at the bottom */}
        <ZuffyChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          disabled={!canSendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  innerContainer: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 16,
  },
  chatContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    color: Colors.light.primary,
    textAlign: "center",
  },
  typingIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: Colors.light.textMuted,
    fontStyle: "italic",
  },
});
