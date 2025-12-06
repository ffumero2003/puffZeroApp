import SeparatorRow from "@/src/components/onboarding/separatorRow";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import AppText from "../../src/components/appText";
import AuthHeader from "../../src/components/auth/authHeader";
import ContinueButton from "../../src/components/onboarding/continueButton";
import GoogleButton from "../../src/components/onboarding/googleButton";
import OnboardingHeader from "../../src/components/onboarding/onboardingHeader";
import UnderlineInput from "../../src/components/onboarding/underlineInput";
import { Colors } from "../../src/constants/theme";
import { useAuth } from "../../src/providers/authProvider";

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

    router.replace("/loginSuccess"); // o la vista real de home que usás
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
      <View style={styles.container}>
        <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />

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
          <AppText style={styles.errorText} weight="extrabold">
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
          <AppText style={styles.errorText} weight="extrabold">
            {passwordError}
          </AppText>
        ) : null}

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgotPassword")}
          style={styles.forgotContainer}
        >
          <AppText weight="bold" style={styles.forgotLink}>
            Recuperar
          </AppText>
        </TouchableOpacity>

        <ContinueButton
          text="Iniciar Sesión"
          onPress={handleLogin}
          disabled={isInvalid}
        />


        <SeparatorRow />

        <GoogleButton />

        <View style={styles.bottomContainer}>
          <AppText style={styles.text}>
            Al iniciar sesión, confirmás que leíste y aceptás la{" "}
            <AppText
              weight="bold"
              style={styles.link}
              onPress={() => router.push("/privacyPolicy")}
            >
              Política de Privacidad
            </AppText>{" "}
            y los{" "}
            <AppText
              weight="bold"
              style={styles.link}
              onPress={() => router.push("/termsOfUse")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  forgotContainer: {
    marginTop: 10,
    alignSelf: "flex-start",
  },

  forgotLink: {
    color: Colors.light.primary,
    fontSize: 18,
  },

  errorText: {
    color: Colors.light.danger,
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30, // ajustá según tu diseño
  },

  text: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.light.textMuted,
    lineHeight: 20,
  },

  link: {
    color: Colors.light.primary,
  },

});
