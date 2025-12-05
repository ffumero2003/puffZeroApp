import { router } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Logo from "../../assets/images/logoPuffZero.png";
import AppText from "../../src/components/appText";
import GoogleButton from "../../src/components/onboarding/googleButton";
import KeepGoingButton from "../../src/components/onboarding/keepGoingButton";
import OnboardingHeader from "../../src/components/onboarding/onboardingHeader";
import SeparatorRow from "../../src/components/onboarding/separatorRow";
import UnderlineInput from "../../src/components/onboarding/underlineInput";
import { Colors } from "../../src/constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");

  return (
    <View style={styles.container}>
      <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />

      {/* Título */}
      <AppText weight="bold" style={styles.title}>Crear Cuenta</AppText>
      <AppText weight="semibold" style={styles.subtitle}>
        Configurá tu cuenta y empezá tu proceso.
      </AppText>

      <ScrollView>
          <UnderlineInput
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          keyboardType="default"
        />

        <UnderlineInput
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Contraseña */}
        <UnderlineInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
        />

       
        {/* Botón principal */}
        <KeepGoingButton text="Registrarse" onPress={() => { router.push("/(auth)/onboarding/review")}} />

        {/* Separador */}
        {/* Separador con líneas */}
        <SeparatorRow />


        <GoogleButton />

    

        {/* Icono de nube (opcional debajo) */}
        <View style={{ alignItems: "center"}}>
          <Image
            source={Logo}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
   title: {
    fontSize: 30,
    color: Colors.light.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    marginBottom: 10,
    opacity: 0.5
  },
  input: {
    backgroundColor: "#E6E4FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 18,
    marginTop: 30,
    color: Colors.light.text,
    fontFamily: "Manrope_400Regular",
  },
  or: {
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 22,
    marginVertical: 18,
  },
 

  image: {
    width: "100%",
    height: 200
  }, 
  separatorRow: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 14,
  },

  forgotContainer: {
  marginTop: 10,
  alignSelf: "flex-start",
},

forgotLink: {
  color: Colors.light.primary,
  fontSize: 18,
},


});