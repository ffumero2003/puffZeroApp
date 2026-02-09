// src/components/app/settings/SettingsSection.tsx
import AppText from "@/src/components/AppText";
// NEW: Dynamic colors
import { useThemeColors } from "@/src/providers/theme-provider";
import { StyleSheet, View } from "react-native";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  // NEW: Dynamic colors
  const colors = useThemeColors();

  return (
    // NEW: Dynamic card background and shadow
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <AppText
        weight="semibold"
        style={[styles.sectionTitle, { color: colors.textMuted }]}
      >
        {title}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
  },
});
