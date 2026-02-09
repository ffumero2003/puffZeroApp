import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function CheckItem({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);

  const colors = useThemeColors();

  return (
    <View style={styles.checkItem}>
      <Animated.View
        style={[
          styles.circle,
          active
            ? { borderColor: colors.primary, backgroundColor: colors.primary }
            : styles.circleInactive,
          {
            transform: [{ scale: scaleAnim }],
            opacity: active ? opacityAnim : 1,
          },
        ]}
      >
        {active && <AppText style={styles.checkMark}>✓</AppText>}
      </Animated.View>

      <AppText
        style={[
          styles.text,
          { color: active ? colors.text : colors.textSecondary },
        ]}
        weight="bold"
      >
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  checkItem: {
    width: "70%", // 🔥 CLAVE
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  circleInactive: {
    backgroundColor: "transparent",
  },

  checkMark: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 14,
  },

  text: {
    fontSize: 18,
  },
});
