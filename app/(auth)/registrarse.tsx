import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View
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

import { useAuth } from "@/src/providers/auth-provider";
import { layout } from "@/src/styles/layout";
import { useRegisterViewModel } from "@/src/viewmodels/auth/useRegisterViewModel";


export default function Register() {
  const { setAuthInProgress } = useAuth();
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

    // if (ok) {
    //   router.push(ROUTES.POST_SIGNUP_REVIEW);
    // }
    setAuthInProgress(false);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <View style={layout.containerAuth}>
          <OnboardingHeader showProgress={false}/>

          <AuthHeader
            title="Crear Cuenta"
            subtitle="Empezá tu proceso."
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            >
            {/* Nombre */}
            <UnderlineInput
              placeholder="Nombre Completo"
              value={nombre}
              onChangeText={onNameChange}
              fieldType="name"
            />
            {nombreError && (
              <AppText style={layout.errorText} weight="extrabold">
                {nombreError}
              </AppText>
            )}

            {/* Email */}
            <UnderlineInput
              placeholder="Correo"
              value={email}
              onChangeText={onEmailChange}
              fieldType="email"
            />
            {emailError && (
              <AppText style={layout.errorText} weight="extrabold">
                {emailError}
              </AppText>
            )}

            {/* Contraseña */}
            <UnderlineInput
              placeholder="Contraseña"
              value={password}
              onChangeText={onPasswordChange}
              fieldType="password"
              secureTextEntry
            />
            {passwordError && (
              <AppText style={layout.errorText} weight="extrabold">
                {passwordError}
              </AppText>
            )}

            {/* Confirmar contraseña */}
            <UnderlineInput
              placeholder="Confirmar contraseña"
              value={confirm}
              onChangeText={onConfirmChange}
              fieldType="confirmPassword"
              secureTextEntry
            />
            {confirmError && (
              <AppText style={layout.errorText} weight="extrabold">
                {confirmError}
              </AppText>
            )}

            {/* Botón */}
            <ContinueButtonAuth
              text="Registrarse"
              disabled={isInvalid}
              onPress={handleRegister}
              
            />

            <SeparatorRow />
            <GoogleButton mode="register" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );

}
