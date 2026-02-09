// NEW: Simple theme picker modal component (inline, follows your modal patterns)
import AppText from "@/src/components/AppText";
import { ThemePreference } from "@/src/constants/theme";
import { useThemeColors } from "@/src/providers/theme-provider";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ThemePickerModal({
  visible,
  onClose,
  selectedValue,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  selectedValue: ThemePreference;
  onSelect: (value: ThemePreference) => void;
}) {
  const colors = useThemeColors();
  const options: { label: string; value: ThemePreference }[] = [
    { label: "Sistema", value: "system" },
    { label: "Claro", value: "light" },
    { label: "Oscuro", value: "dark" },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={[styles.modalOverlay, { backgroundColor: colors.background }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <AppText
            weight="bold"
            style={[styles.modalTitle, { color: colors.text }]}
          >
            Tema de la Aplicación
          </AppText>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.modalOption,
                { borderBottomColor: colors.border },
                selectedValue === option.value && {
                  backgroundColor: colors.secondary,
                },
                index === options.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <AppText
                weight={selectedValue === option.value ? "bold" : "regular"}
                style={{
                  fontSize: 16,
                  color:
                    selectedValue === option.value
                      ? colors.primary
                      : colors.text,
                }}
              >
                {option.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  // NEW: Modal styles for the theme picker
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
});
