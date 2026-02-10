import { router } from "expo-router";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import AppText from "@/src/components/AppText";
import AuthHeader from "@/src/components/auth/AuthHeader";
import ContinueButtonAuth from "@/src/components/auth/ContinueButtonAuth";
import GoogleButton from "@/src/components/onboarding/GoogleButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import SeparatorRow from "@/src/components/onboarding/SeparatorRow";
import UnderlineInput from "@/src/components/onboarding/UnderlineInput";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useLoginViewModel } from "@/src/viewmodels/auth/useLoginViewModel";
import * as Haptics from "expo-haptics";

export default function Login() {
  const colors = useThemeColors();
  const {
    email,
    password,
    emailError,
    passwordError,
    loading,
    isInvalid,
    onEmailChange,
    onPasswordChange,
    submit,
  } = useLoginViewModel();

  const handleLogin = async () => {
    const ok = await submit();
    if (ok) {
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[layout.containerAuth, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader showProgress={false} />

        <AuthHeader
          title="Iniciar Sesión"
          subtitle="Vuelve a tomar control de tu vida"
        />

        {/* Email */}
        <UnderlineInput
          placeholder="Correo"
          value={email}
          onChangeText={onEmailChange}
          fieldType="email"
        />
        {emailError ? (
          <AppText
            style={[layout.errorText, { color: colors.danger }]}
            weight="extrabold"
          >
            {emailError}
          </AppText>
        ) : null}

        {/* Password */}
        <UnderlineInput
          placeholder="Contraseña"
          value={password}
          onChangeText={onPasswordChange}
          fieldType="password"
          secureTextEntry
        />
        {passwordError ? (
          <AppText
            style={[layout.errorText, { color: colors.danger }]}
            weight="extrabold"
          >
            {passwordError}
          </AppText>
        ) : null}

        {/* Forgot password */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(auth)/forgot-password");
          }}
          style={layout.forgotContainer}
        >
          <AppText
            weight="bold"
            style={[layout.forgotLink, { color: colors.text }]}
          >
            Recuperar
          </AppText>
        </TouchableOpacity>

        <ContinueButtonAuth
          text={loading ? "Ingresando..." : "Iniciar Sesión"}
          onPress={handleLogin}
          disabled={isInvalid}
        />

        <SeparatorRow />

        <GoogleButton mode="login" />

        <View style={layout.bottomContainer}>
          <AppText style={[layout.text, { color: colors.text }]}>
            Al iniciar sesión, confirmás que aceptás la{" "}
            <AppText
              weight="extrabold"
              style={{ color: colors.primary }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/privacy-policy");
              }}
            >
              Política de Privacidad
            </AppText>{" "}
            y los{" "}
            <AppText
              weight="extrabold"
              style={{ color: colors.primary }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/terms-of-use");
              }}
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
