import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import AppText from "../appText";

export default function GoogleButton(){
  return(
    <TouchableOpacity style={styles.googleBtn} activeOpacity={0.7}>
      <Ionicons name="logo-google" size={20} color="#fff" />
      <AppText weight="semibold" style={styles.googleText}>
        Continuar con Google
      </AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  googleBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 18,
  },



});