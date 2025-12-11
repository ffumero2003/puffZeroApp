import SeparatorRow from "@/src/components/onboarding/separator-row";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import AppText from "../../src/components/app-text";
import AuthHeader from "../../src/components/auth/auth-header";
import ContinueButtonAuth from "../../src/components/auth/continueButtonAuth";
import GoogleButton from "../../src/components/onboarding/google-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import UnderlineInput from "../../src/components/onboarding/underline-input";
import { useAuth } from "../../src/providers/auth-provider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Supabase login

  const { signIn } = useAuth();

  async function handleLogin() {
    const { data, error } = await signIn(email, password);

    if (error) {
      Alert.alert("Error al iniciar sesión", error.message);
      return;
    }

    router.replace("/home"); // o la vista real de home que usás
  }


  /** --------------------------
   * VALIDACIONES
   -----------------------------*/
  const validateEmail = (value: string) => {
    setEmail(value);

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Este campo es obligatorio.");
    } else if (!regex.test(value)) {
      setEmailError("Correo inválido.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    setPassword(value);

    if (!value) {
      setPasswordError("Este campo es obligatorio.");
    } else if (value.length < 6) {
      setPasswordError("Mínimo 6 caracteres.");
    } else {
      setPasswordError("");
    }
  };

  /** BOTÓN DESHABILITADO SI HAY ERRORES */
  const isInvalid = !email || !password || emailError || passwordError;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={layout.containerAuth}>
        <OnboardingHeader showProgress={false} style={{ marginBottom: 30 }} />

        <AuthHeader
          title="Iniciar Sesión"
          subtitle="Vuelve a tomar control de tu vida"
        />

        {/* CORREO */}
        <UnderlineInput
          placeholder="Correo"
          value={email}
          onChangeText={validateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailError ? (
          <AppText style={layout.errorText} weight="extrabold">
            {emailError}
          </AppText>
        ) : null}

        {/* CONTRASEÑA */}
        <UnderlineInput
          placeholder="Contraseña"
          value={password}
          onChangeText={validatePassword}
          autoCapitalize="none"
          secureTextEntry
        />
        {passwordError ? (
          <AppText style={layout.errorText} weight="extrabold">
            {passwordError}
          </AppText>
        ) : null}

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={layout.forgotContainer}
        >
          <AppText weight="bold" style={ layout.forgotLink }>
            Recuperar
          </AppText>
        </TouchableOpacity>

        <ContinueButtonAuth
          text="Iniciar Sesión"
          onPress={handleLogin}
          disabled={isInvalid}
        />
        


        <SeparatorRow />

        <GoogleButton />

        <View style={layout.bottomContainer}>
          <AppText style={layout.text}>
            Al iniciar sesión, confirmás que leíste y aceptás la{" "}
            <AppText
              weight="bold"
              style={layout.linkLogin}
              onPress={() => router.push("/privacy-policy")}
            >
              Política de Privacidad
            </AppText>{" "}
            y los{" "}
            <AppText
              weight="bold"
              style={layout.linkLogin}
              onPress={() => router.push("/terms-of-use")}
            >
              Términos de Uso
            </AppText>
            .
          </AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );


}


