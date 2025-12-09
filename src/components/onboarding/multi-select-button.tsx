import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../src/constants/theme";
import AppText from "../app-text";

export default function MultiSelectButton({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, selected && styles.buttonSelected]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <AppText weight="semibold" style={[styles.text, selected && styles.textSelected]}>
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#C9D2FB",
  },
  buttonSelected: {
    backgroundColor: "#E5E0FF",
    borderColor: Colors.light.primary,
  },
  text: {
    fontSize: 20,
    color: Colors.light.text,
  },
  textSelected: {
    color: Colors.light.primary,
  },
});
