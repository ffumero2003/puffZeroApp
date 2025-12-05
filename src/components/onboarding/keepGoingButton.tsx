import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../../constants/theme";
import AppText from "../appText";

interface Props {
  text: string;
  onPress: () => void;
  style?: ViewStyle; // estilos opcionales para override
}

export default function KeepGoingButton({ text, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <AppText weight="bold" style={styles.buttonText}>
        {text}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: "100%",
    
  },
  buttonText: {
    textAlign: "center",
    fontSize: 22,
    color: "#fff",
  },
});
