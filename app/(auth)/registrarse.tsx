import { useState } from "react";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from "@/src/lib/auth/auth.validation";

import AppText from "@/src/components/AppText";
import AuthHeader from "@/src/components/auth/AuthHeader";
import ContinueButtonAuth from "@/src/components/auth/ContinueButtonAuth";
import GoogleButton from "@/src/components/onboarding/GoogleButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import SeparatorRow from "@/src/components/onboarding/SeparatorRow";
import UnderlineInput from "@/src/components/onboarding/UnderlineInput";

import { layout } from "@/src/styles/layout";
import { useRegisterViewModel } from "@/src/viewmodels/auth/useRegisterViewModel";

import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";

export default function Register() {
  /* ---------------------------
     STATE 
  ------------------------------*/
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nombre, setNombre] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [nombreError, setNombreError] = useState("");

  const { register } = useRegisterViewModel();

  /* ---------------------------
     HANDLERS
  ------------------------------*/
  const onEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));

    // 🔥 Revalidar confirmación si ya existe
    if (confirm) {
      setConfirmError(validateConfirmPassword(value, confirm));
    }
  };

  const onConfirmChange = (value: string) => {
    setConfirm(value);
    setConfirmError(validateConfirmPassword(password, value));
  };

  const onNameChange = (value: string) => {
    setNombre(value);
    setNombreError(validateFullName(value));
  };

  const handleRegister = async () => {
    const ok = await register({
      email,
      password,
      nombre,
    });

    if (ok) {
      router.push(ROUTES.POST_SIGNUP_REVIEW);
    }
  };


  /* ---------------------------
     VALID STATE
  ------------------------------*/
  const isInvalid =
    !email ||
    !password ||
    !confirm ||
    !nombre ||
    Boolean(emailError) ||
    Boolean(passwordError) ||
    Boolean(confirmError) ||
    Boolean(nombreError);

  /* ---------------------------
     UI
  ------------------------------*/
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={layout.containerAuth}>
        <OnboardingHeader showProgress={false} style={{ marginBottom: 30 }} />

        <AuthHeader
          title="Crear Cuenta"
          subtitle="Configurá tu cuenta y empezá tu proceso."
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Nombre */}
          <UnderlineInput
            placeholder="Nombre Completo"
            value={nombre}
            onChangeText={onNameChange}
            autoCapitalize="words"
            keyboardType="default"
          />
          {nombreError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {nombreError}
            </AppText>
          ) : null}

          {/* Email */}
          <UnderlineInput
            placeholder="Correo"
            value={email}
            onChangeText={onEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {emailError}
            </AppText>
          ) : null}

          {/* Contraseña */}
          <UnderlineInput
            placeholder="Contraseña"
            value={password}
            onChangeText={onPasswordChange}
            autoCapitalize="none"
            secureTextEntry
          />
          {passwordError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {passwordError}
            </AppText>
          ) : null}

          {/* Confirmar contraseña */}
          <UnderlineInput
            placeholder="Confirmar contraseña"
            value={confirm}
            onChangeText={onConfirmChange}
            autoCapitalize="none"
            secureTextEntry
            style={{ marginTop: 16 }}
          />
          {confirmError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {confirmError}
            </AppText>
          ) : null}

          {/* Botón */}
          <ContinueButtonAuth
            text="Registrarse"
            disabled={isInvalid}
            onPress={handleRegister}
            style={{ marginTop: 30 }}
          />

          <SeparatorRow />

          <GoogleButton mode="register" />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
