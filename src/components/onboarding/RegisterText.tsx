import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { components } from "../../../src/styles/components";
import AppText from "../AppText";

export default function RegisterText(){
  return(
    <TouchableOpacity
      onPress={() => router.push("/(auth)/registrarse")}
      style={{ marginTop: 30 }}
      >
      <AppText style={components.register}>
        ¿No tenés cuenta? <AppText weight="bold" style={components.link}>Registrate</AppText>
      </AppText>
    </TouchableOpacity>
  )
}

