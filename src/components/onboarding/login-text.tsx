import { router } from "expo-router";
import { components } from "../../../src/styles/components";
import AppText from "../app-text";

export default function LoginText(){
  return(
    <AppText style={components.footer}>
          ¿Ya tienes cuenta?{" "}
          <AppText
          weight="extrabold"
          style={components.link}
          onPress={() => router.push("/(auth)/login")}
          >
          Ingresar
      </AppText>
    </AppText>
  )
}
