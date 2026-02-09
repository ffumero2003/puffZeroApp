// src/components/app/settings/PickerModal.tsx
// Custom picker modal that works with Expo Go (no native dependencies)

import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PickerOption {
  label: string;
  value: string | number;
}

interface PickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption[];
  selectedValue: string | number;
  onValueChange: (value: any) => void;
}

export default function PickerModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onValueChange,
}: PickerModalProps) {
  const colors = useThemeColors();

  // Handle option selection
  const handleSelect = (value: string | number) => {
    onValueChange(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Prevent closing when pressing content */}
        {/* Dynamic background from theme */}
        <Pressable style={[styles.content, { backgroundColor: colors.card }]}>
          {/* Header - dynamic border color */}
          <View
            style={[styles.header, { borderBottomColor: colors.secondary }]}
          >
            <AppText
              weight="bold"
              style={[styles.title, { color: colors.text }]}
            >
              {title}
            </AppText>
            <TouchableOpacity onPress={onClose}>
              <AppText
                weight="semibold"
                style={[styles.doneButton, { color: colors.primary }]}
              >
                Listo
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Options List */}
          <ScrollView
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionRow,
                    { borderBottomColor: colors.secondary },
                    // Highlight selected row with theme secondary color
                    isSelected && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.6}
                >
                  <AppText
                    weight={isSelected ? "bold" : "regular"}
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      // Selected text uses primary color
                      isSelected && { color: colors.primary },
                    ]}
                  >
                    {option.label}
                  </AppText>

                  {/* Checkmark for selected - uses primary color */}
                  {isSelected && (
                    <AppText
                      style={[styles.checkmark, { color: colors.primary }]}
                    >
                      ✓
                    </AppText>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Static styles only - no colors here, all colors are applied inline above
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
  },
  doneButton: {
    fontSize: 16,
  },
  optionsList: {
    paddingBottom: 34,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
  },
});
