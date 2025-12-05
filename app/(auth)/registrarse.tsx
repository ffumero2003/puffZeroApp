import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import AppText from "../../src/components/appText";
import AuthHeader from "../../src/components/auth/authHeader";
import ContinueButton from "../../src/components/onboarding/continueButton";
import GoogleButton from "../../src/components/onboarding/googleButton";
import OnboardingHeader from "../../src/components/onboarding/onboardingHeader";
import SeparatorRow from "../../src/components/onboarding/separatorRow";
import UnderlineInput from "../../src/components/onboarding/underlineInput";
import { Colors } from "../../src/constants/theme";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usuarioError, setUsuarioError] = useState("");

  /* ---------------------------
     VALIDACIONES
  ------------------------------*/

  const validateUsuario = (value: string) => {
    setUsuario(value);

    if (!value.trim()) setUsuarioError("Este campo es obligatorio.");
    else if (value.length < 3) setUsuarioError("Mínimo 3 caracteres.");
    else if (/\s/.test(value)) setUsuarioError("No puede contener espacios.");
    else setUsuarioError("");
  };

  const validateEmail = (value: string) => {
    setEmail(value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) setEmailError("Este campo es obligatorio.");
    else if (!regex.test(value)) setEmailError("Correo inválido.");
    else setEmailError("");
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    if (!value) setPasswordError("Este campo es obligatorio.");
    else if (value.length < 6) setPasswordError("Mínimo 6 caracteres.");
    else setPasswordError("");
  };

  /* ---------------------------
     DESHABILITAR BOTÓN
  ------------------------------*/
  const isInvalid =
    !email ||
    !password ||
    !usuario ||
    emailError ||
    passwordError ||
    usuarioError;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />

        {/* Título */}
        <AuthHeader
          title="Crear Cuenta"
          subtitle="Configurá tu cuenta y empezá tu proceso."
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Usuario */}
          <UnderlineInput
            placeholder="Usuario"
            value={usuario}
            onChangeText={validateUsuario}
            autoCapitalize="none"
            keyboardType="default"
          />
          {usuarioError ? (
            <AppText style={styles.errorText}>{usuarioError}</AppText>
          ) : null}

          {/* Correo */}
          <UnderlineInput
            placeholder="Correo"
            value={email}
            onChangeText={validateEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? (
            <AppText style={styles.errorText}>{emailError}</AppText>
          ) : null}

          {/* Contraseña */}
          <UnderlineInput
            placeholder="Contraseña"
            value={password}
            onChangeText={validatePassword}
            autoCapitalize="none"
            secureTextEntry
          />
          {passwordError ? (
            <AppText style={styles.errorText}>{passwordError}</AppText>
          ) : null}

          {/* Botón principal */}
          <ContinueButton
            text="Registrarse"
            disabled={isInvalid}
            onPress={() => router.push("/(auth)/onboarding/review")}
            style={{ marginTop: 30 }}
          />

          {/* Separador */}
          <SeparatorRow />

          {/* Google Login */}
          <GoogleButton />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  errorText: {
    color: Colors.light.danger,
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4,
  },
});
