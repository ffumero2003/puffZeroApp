import SeparatorRow from "@/src/components/onboarding/separatorRow";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Logo from "../../assets/images/logoPuffZero.png";
import AppText from "../../src/components/appText";
import GoogleButton from "../../src/components/onboarding/googleButton";
import KeepGoingButton from "../../src/components/onboarding/keepGoingButton";
import OnboardingHeader from "../../src/components/onboarding/onboardingHeader";
import RegisterText from "../../src/components/onboarding/registerText";
import UnderlineInput from "../../src/components/onboarding/underlineInput";
import { Colors } from "../../src/constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />

      {/* Título */}
      <AppText weight="bold" style={styles.title}>Iniciar Sesión</AppText>
      <AppText weight="semibold" style={styles.subtitle}>
        Vuelve a tomar control de tu vida
      </AppText>
      

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

      {/* Forgot Password */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/forgotPassword")}
        style={styles.forgotContainer}
      >
        
       <AppText weight="bold" style={styles.forgotLink}>Recuperar</AppText>
        
      </TouchableOpacity>


      {/* Botón principal */}
      <KeepGoingButton text="Iniciar Sesión" onPress={() => {}} />

       {/* Separador */}
      {/* Separador con líneas */}
      <SeparatorRow />


      {/* Google Login */}
      <GoogleButton />

      {/* Ir al registro */}
      <RegisterText />

      {/* Icono de nube (opcional debajo) */}
      <View style={{ alignItems: "center"}}>
        <Image
          source={Logo}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

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
 

  forgotContainer: {
  marginTop: 10,
  alignSelf: "flex-start",
},

forgotLink: {
  color: Colors.light.primary,
  fontSize: 18,
},


});