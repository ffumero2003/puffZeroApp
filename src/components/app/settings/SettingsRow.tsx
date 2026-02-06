// src/components/app/settings/SettingsRow.tsx
// Reusable row for settings (pressable or static)

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode; // For custom elements like Switch
  isLast?: boolean;
}

export default function SettingsRow({
  label,
  value,
  onPress,
  showChevron = true,
  rightElement,
  isLast = false,
}: SettingsRowProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.row, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <AppText style={styles.label}>{label}</AppText>

      {/* Right side: either custom element or value with chevron */}
      {rightElement ? (
        rightElement
      ) : (
        <View style={styles.valueContainer}>
          {value && (
            <AppText weight="medium" style={styles.value}>
              {value}
            </AppText>
          )}
          {showChevron && onPress && (
            <AppText style={styles.chevron}>›</AppText>
          )}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    color: Colors.light.textMuted,
    marginRight: 8,
  },
  chevron: {
    fontSize: 20,
    color: Colors.light.textMuted,
  },
});
