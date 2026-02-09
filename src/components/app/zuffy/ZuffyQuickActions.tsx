// src/components/app/zuffy/ZuffyQuickActions.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { QUICK_ACTION_PROMPTS } from "@/src/services/zuffy-ai-service";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  onActionPress: (prompt: string) => void;
  disabled?: boolean;
};

const QUICK_ACTIONS = [
  {
    id: "howToFeel",
    label: "¿Cómo debo sentirme?",
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
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map((action, index) => (
        <Pressable
          key={action.id}
          style={({ pressed }) => [
            styles.chip,
            {
              backgroundColor: pressed ? colors.border : colors.secondary,
              borderColor: colors.border,
            },
            index < 2 ? styles.chipHalf : styles.chipFull,
            disabled && { opacity: 0.5 },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onActionPress(action.prompt);
          }}
          disabled={disabled}
        >
          <AppText
            numberOfLines={1}
            weight="bold"
            style={{
              fontSize: 13,
              color: disabled ? colors.textMuted : colors.text,
              textAlign: "center",
            }}
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
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipHalf: {
    width: "49%",
  },
  chipFull: {
    flexBasis: "100%",
    alignSelf: "center",
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: "70%",
  },
});
