// src/components/app/zuffy/ZuffyTypingIndicator.tsx
// Animated three-dot typing indicator that looks like a Zuffy chat bubble
// Shows when Zuffy is "thinking" after the user sends a message or uses a quick action

import { Colors } from "@/src/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function ZuffyTypingIndicator() {
  // Create 3 animated values, one for each dot
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Helper: creates a looping bounce animation for a single dot
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          // Wait before starting (creates the staggered effect between dots)
          Animated.delay(delay),
          // Bounce up
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          // Bounce back down
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start all three dot animations in parallel, each with a staggered delay
    const animation = Animated.parallel([
      animateDot(dot1, 0), // First dot starts immediately
      animateDot(dot2, 200), // Second dot starts 200ms later
      animateDot(dot3, 400), // Third dot starts 400ms later
    ]);

    animation.start();

    // Clean up animations when component unmounts
    return () => animation.stop();
  }, [dot1, dot2, dot3]);

  // Each dot translates up by -6px at peak, creating a bounce effect
  const getDotStyle = (dotAnim: Animated.Value) => ({
    transform: [
      {
        translateY: dotAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6], // Moves up 6px when animated
        }),
      },
    ],
  });

  return (
    // Outer container matches the assistant bubble alignment (left-aligned)
    <View style={styles.container}>
      {/* Bubble matches the same style as ZuffyChatBubble's assistant bubble */}
      <View style={styles.bubble}>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, getDotStyle(dot1)]} />
          <Animated.View style={[styles.dot, getDotStyle(dot2)]} />
          <Animated.View style={[styles.dot, getDotStyle(dot3)]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Left-aligned like assistant messages in ZuffyChatBubble
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: "flex-start",
  },
  // Matches the assistant bubble style from ZuffyChatBubble
  bubble: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  // Horizontal row for the three dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  // Each individual dot
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.textMuted, // Muted color so it's subtle
  },
});
