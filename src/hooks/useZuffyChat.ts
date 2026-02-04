// src/hooks/useZuffyChat.ts
// This hook manages the chat state, message history, and daily message limits
// It's the "brain" of the chat feature, handling all the logic

import {
  ChatMessage,
  sendMessageToZuffy,
  ZuffyUserContext,
} from "@/src/services/zuffy-ai-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

// Keys for storing message count in AsyncStorage
// We use AsyncStorage because we need to persist the count across app restarts
// but within the same day
const MESSAGE_COUNT_KEY = "zuffy_message_count";
const MESSAGE_DATE_KEY = "zuffy_message_date";

// Maximum messages per user per day
// This helps control API costs while still providing value to users
const MAX_MESSAGES_PER_DAY = 20;

export function useZuffyChat(userContext: ZuffyUserContext) {
  // State for managing messages in the current conversation
  // This array holds all messages exchanged in the current session
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Loading state to show typing indicator when Zuffy is "thinking"
  const [isLoading, setIsLoading] = useState(false);

  // Track how many messages the user has sent today
  const [messageCount, setMessageCount] = useState(0);

  // Track if we've loaded the initial count from storage
  const [isInitialized, setIsInitialized] = useState(false);

  // Load the message count from AsyncStorage when the hook initializes
  // This runs once when the component mounts
  useEffect(() => {
    loadMessageCount();
  }, []);

  // Function to load and validate the daily message count
  const loadMessageCount = async () => {
    try {
      // Get both the count and the date it was stored
      const [storedCount, storedDate] = await Promise.all([
        AsyncStorage.getItem(MESSAGE_COUNT_KEY),
        AsyncStorage.getItem(MESSAGE_DATE_KEY),
      ]);

      const today = new Date().toDateString();

      // Check if the stored date is today
      // If it's a new day, we reset the count to 0
      if (storedDate === today && storedCount) {
        setMessageCount(parseInt(storedCount, 10));
      } else {
        // New day - reset the count
        await AsyncStorage.setItem(MESSAGE_DATE_KEY, today);
        await AsyncStorage.setItem(MESSAGE_COUNT_KEY, "0");
        setMessageCount(0);
      }
    } catch (error) {
      console.error("Error loading message count:", error);
    } finally {
      setIsInitialized(true);
    }
  };

  // Function to increment and save the message count
  const incrementMessageCount = async () => {
    const newCount = messageCount + 1;
    setMessageCount(newCount);

    try {
      await AsyncStorage.setItem(MESSAGE_COUNT_KEY, newCount.toString());
    } catch (error) {
      console.error("Error saving message count:", error);
    }
  };

  // Check if the user can still send messages today
  // We expose this so the UI can disable the input when limit is reached
  const canSendMessage = messageCount < MAX_MESSAGES_PER_DAY;

  // Calculate remaining messages for display in the UI
  const remainingMessages = MAX_MESSAGES_PER_DAY - messageCount;

  // Main function to send a message and get a response
  const sendMessage = useCallback(
    async (userMessage: string) => {
      // Don't send if we've hit the limit or already processing
      if (!canSendMessage || isLoading) {
        return;
      }

      // Don't send empty messages
      if (!userMessage.trim()) {
        return;
      }

      // Add the user's message to the conversation immediately
      // This provides instant feedback to the user
      const newUserMessage: ChatMessage = {
        role: "user",
        content: userMessage.trim(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        // Send to AI and get response
        // We pass the current messages (without the new one) as history
        // because the service will add the new message itself
        const response = await sendMessageToZuffy(
          userMessage.trim(),
          messages, // Current conversation history
          userContext
        );

        // Add Zuffy's response to the conversation
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Only increment count after successful response
        // This way we don't penalize users for failed requests
        await incrementMessageCount();
      } catch (error) {
        console.error("Error sending message:", error);

        // Add an error message so the user knows something went wrong
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "Ups, algo salió mal. ¿Podrías intentarlo de nuevo? 🙏",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, userContext, canSendMessage, isLoading, messageCount]
  );

  // Function to clear the chat (start fresh)
  // Note: This doesn't reset the daily message count, only the conversation
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    canSendMessage,
    remainingMessages,
    messageCount,
    maxMessages: MAX_MESSAGES_PER_DAY,
    isInitialized,
  };
}
