import { Colors } from "@/src/constants/theme";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../appText";

export default function OnboardingWhiteButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onPress}>
      <AppText weight="semibold" style={styles.text}>
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
  text: {
    fontSize: 20,
    color: Colors.light.text,
  },
});
