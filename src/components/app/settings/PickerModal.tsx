// src/components/app/settings/PickerModal.tsx
// Custom picker modal that works with Expo Go (no native dependencies)

import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
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
        <Pressable style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <AppText weight="bold" style={styles.title}>
              {title}
            </AppText>
            <TouchableOpacity onPress={onClose}>
              <AppText weight="semibold" style={styles.doneButton}>
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
                    isSelected && styles.optionRowSelected,
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.6}
                >
                  <AppText
                    weight={isSelected ? "bold" : "regular"}
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </AppText>

                  {/* Checkmark for selected */}
                  {isSelected && <AppText style={styles.checkmark}>✓</AppText>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
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
    borderBottomColor: Colors.light.secondary,
  },
  title: {
    fontSize: 18,
    color: Colors.light.text,
  },
  doneButton: {
    fontSize: 16,
    color: Colors.light.primary,
  },
  optionsList: {
    paddingBottom: 34, // Safe area for iOS
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.secondary,
  },
  optionRowSelected: {
    backgroundColor: Colors.light.secondary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  optionTextSelected: {
    color: Colors.light.primary,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.light.primary,
  },
});
