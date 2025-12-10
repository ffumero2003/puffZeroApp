import { router } from "expo-router";
import { layout } from "../../../src/styles/layout";
import AppText from "../app-text";

export default function LoginText(){
  return(
    <AppText style={layout.footer}>
          ¿Ya tienes cuenta?{" "}
          <AppText
          weight="extrabold"
          style={layout.link}
          onPress={() => router.push("/(auth)/login")}
          >
          Ingresar
      </AppText>
    </AppText>
  )
}
