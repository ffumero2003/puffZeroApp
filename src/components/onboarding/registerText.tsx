import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/theme";
import AppText from "../appText";

export default function RegisterText(){
  return(
    <TouchableOpacity
      onPress={() => router.push("/(auth)/registrarse")}
      style={{ marginTop: 30 }}
      >
      <AppText style={styles.register}>
        ¿No tenés cuenta? <AppText weight="bold" style={styles.link}>Registrate</AppText>
      </AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  register: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.light.text,
  },
  link: {
    color: Colors.light.primary,
  },

});