import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View
} from "react-native";
import AppText from "../../src/components/app-text";
import ContinueButton from "../../src/components/onboarding/continue-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import UnderlineInput from "../../src/components/onboarding/underline-input";
import { resetPassword } from "../../src/services/auth-services";
import { layout } from "../../src/styles/layout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // VALIDACIÓN
  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    setEmail(trimmed);

    if (!trimmed) {
      setEmailError("Este campo es obligatorio.");
      return;
    }

    if (/\s/.test(trimmed)) {
      setEmailError("El correo no puede tener espacios.");
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(trimmed)) {
      setEmailError("Correo inválido.");
      return;
    }

    setEmailError(""); // válido
  };

  // SUBMIT
  const handleReset = async () => {
    if (emailError || !email.trim()) {
      alert("Ingresá un correo válido.");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Te enviamos un enlace para restablecer tu contraseña.");
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={layout.screenContainer}>
          <View>
            {/* 🚫 Header sin back ni progress, solo espacio */}
            <OnboardingHeader step={0} total={11} showBack={true} showProgress={false} />

            {/* 🔵 TÍTULO */}
            <View style={layout.content}>
              <AppText weight="bold" style={layout.title}>
                ¿Olvidaste tu contraseña?
              </AppText>

              <AppText style={layout.subtitle}>
                Ingresá tu correo y te enviaremos un enlace para restablecerla.
              </AppText>
            </View>

            {/* 🟣 INPUT */}
            <UnderlineInput
              placeholder="Correo"
              value={email}
              onChangeText={validateEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* 🔥 ERROR */}
            {emailError ? (
              <AppText style={layout.errorText} weight="extrabold">
                {emailError}
              </AppText>
            ) : null}
          </View>

          {/* 🟢 BOTÓN ABAJO */}
          <ContinueButton
            text={loading ? "Enviando..." : "Restablecer contraseña"}
            onPress={handleReset}
            disabled={loading}
            style={layout.bottomButtonContainer}
          />

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

}

