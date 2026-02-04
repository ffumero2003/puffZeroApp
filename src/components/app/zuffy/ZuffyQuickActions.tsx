// src/components/app/zuffy/ZuffyQuickActions.tsx
// This component displays the quick action buttons/chips
// These help users start conversations without having to think of what to say

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { QUICK_ACTION_PROMPTS } from "@/src/services/zuffy-ai-service";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  onActionPress: (prompt: string) => void;
  disabled?: boolean; // Disable when message limit is reached or loading
};

// Define the quick actions with their display labels and emojis
// These match the prompts defined in the AI service
const QUICK_ACTIONS = [
  {
    id: "howToFeel",
    label: "¿Cómo debería sentirme?",
    emoji: "🌟",
    prompt: QUICK_ACTION_PROMPTS.howToFeel,
  },
  {
    id: "thinkingOfSmoking",
    label: "Pensando en fumar...",
    emoji: "🚭",
    prompt: QUICK_ACTION_PROMPTS.thinkingOfSmoking,
  },
  {
    id: "myProgress",
    label: "¿Qué he logrado hasta ahora?",
    emoji: "💪",
    prompt: QUICK_ACTION_PROMPTS.myProgress,
  },
];

export default function ZuffyQuickActions({ onActionPress, disabled }: Props) {
  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map((action, index) => (
        <Pressable
          key={action.id}
          style={({ pressed }) => [
            styles.chip,
            index < 2 ? styles.chipHalf : styles.chipFull,
            pressed && styles.chipPressed,
            disabled && styles.chipDisabled,
          ]}
          onPress={() => onActionPress(action.prompt)}
          disabled={disabled}
        >
          {/* numberOfLines={1} prevents text from wrapping to multiple lines */}
          {/* ellipsizeMode="tail" adds "..." if text is too long (fallback) */}
          <AppText
            numberOfLines={1}
            // ellipsizeMode="tail"
            style={[styles.chipText, disabled && styles.chipTextDisabled]}
          >
            {action.label}
            {action.emoji}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow chips to wrap to next line
    justifyContent: "center",
    gap: 6,

    paddingVertical: 10,
  },
  chip: {
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 20,
    // Subtle border for definition
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chipHalf: {
    width: "48%",
    // No flexWrap needed here - that's for containers, not items
  },

  chipFull: {
    flexBasis: "100%", // forces it onto its own row
    alignSelf: "center", // centers within the row
    flexGrow: 0, // don't stretch
    flexShrink: 1, // allow shrinking if needed
    maxWidth: "70%", // safety so it doesn't overflow on small screens
  },

  chipPressed: {
    // Darken slightly when pressed for feedback
    backgroundColor: Colors.light.border,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: 12,
    color: Colors.light.text,
    textAlign: "center",
  },
  chipTextDisabled: {
    color: Colors.light.textMuted,
  },
});
