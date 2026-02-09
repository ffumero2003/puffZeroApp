// src/components/app/settings/SettingsRow.tsx
import AppText from "@/src/components/AppText";
// NEW: Dynamic colors
import { useThemeColors } from "@/src/providers/theme-provider";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
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
  // NEW: Dynamic colors
  const colors = useThemeColors();
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      // NEW: Dynamic border color
      style={[
        styles.row,
        { borderBottomColor: colors.secondary },
        isLast && { borderBottomWidth: 0 },
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <AppText style={[styles.label, { color: colors.text }]}>{label}</AppText>

      {rightElement ? (
        rightElement
      ) : (
        <View style={styles.valueContainer}>
          {value && (
            <AppText
              weight="medium"
              style={[styles.value, { color: colors.textMuted }]}
            >
              {value}
            </AppText>
          )}
          {showChevron && onPress && (
            <AppText style={[styles.chevron, { color: colors.textMuted }]}>
              ›
            </AppText>
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
  },
  label: {
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    marginRight: 8,
  },
  chevron: {
    fontSize: 20,
  },
});
