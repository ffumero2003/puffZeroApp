import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { components } from "../../../src/styles/components";
import AppText from "../app-text";

export default function GoogleButton(){
  return(
    <TouchableOpacity style={components.googleBtn} activeOpacity={0.7}>
      <Ionicons name="logo-google" size={20} color="#fff" />
      <AppText weight="semibold" style={components.googleText}>
        Continuar con Google
      </AppText>
    </TouchableOpacity>
  )
}
