import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { components } from "@/src/styles/components";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";


export default function RegisterText(){
  return(
    <TouchableOpacity
      onPress={() => router.push(ROUTES.REGISTER)}
      style={{ marginTop: 30 }}
      >
      <AppText style={components.register}>
        ¿No tenés cuenta? <AppText weight="bold" style={components.link}>Registrate</AppText>
      </AppText>
    </TouchableOpacity>
  )
}

