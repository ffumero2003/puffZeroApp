import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Colors } from "../../constants/theme";
import AppText from "../app-text";

export default function LoginText(){
  return(
    <AppText style={styles.footer}>
          ¿Ya tienes cuenta?{" "}
          <AppText
          weight="extrabold"
          style={styles.link}
          onPress={() => router.push("/(auth)/login")}
          >
          Ingresar
      </AppText>
    </AppText>
  )
}

const styles = StyleSheet.create({
  footer: {
      marginTop: 20,
      color: Colors.light.text,
      fontSize: 18,
    },
    link: {
      color: Colors.light.primary,
    },
})