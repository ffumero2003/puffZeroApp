import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import AppText from "@/src/components/AppText";
import AuthHeader from "@/src/components/auth/AuthHeader";
import ContinueButtonAuth from "@/src/components/auth/ContinueButtonAuth";
import AppleButton from "@/src/components/onboarding/AppleButton";
import GoogleButton from "@/src/components/onboarding/GoogleButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import SeparatorRow from "@/src/components/onboarding/SeparatorRow";
import UnderlineInput from "@/src/components/onboarding/UnderlineInput";
import { ROUTES } from "@/src/constants/routes";
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from "@/src/lib/auth/auth.validation";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native"; // add Pressable and Vibration to your existing RN import

import { useAuth } from "@/src/providers/auth-provider";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useRegisterViewModel } from "@/src/viewmodels/auth/useRegisterViewModel";
import { router } from "expo-router";

export default function Register() {
  const colors = useThemeColors();
  const { setAuthInProgress } = useAuth();
  /* ---------------------------
     STATE 
  ------------------------------*/
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nombre, setNombre] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [nombreError, setNombreError] = useState("");
  const { register } = useRegisterViewModel();

  const [loading, setLoading] = useState(false);

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
    if (loading) return;
    setLoading(true);
    setAuthInProgress(true);
    try {
      const ok = await register({
        email,
        password,
        nombre,
      });

      if (ok) {
        router.replace(ROUTES.POST_SIGNUP_REVIEW);
      }
    } catch (e) {
      console.error("Register error:", e);
    } finally {
      setAuthInProgress(false);
      setLoading(false);
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
    !acceptedTerms ||
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
        style={{ flex: 1, backgroundColor: colors.background }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <View style={[layout.containerAuth]}>
          <OnboardingHeader showProgress={false} />

          <AuthHeader title="Crear Cuenta" subtitle="Empezá tu proceso." />

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
              <AppText
                style={[layout.errorText, { color: colors.danger }]}
                weight="extrabold"
              >
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
              <AppText
                style={[layout.errorText, { color: colors.danger }]}
                weight="extrabold"
              >
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
              <AppText
                style={[layout.errorText, { color: colors.danger }]}
                weight="extrabold"
              >
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
              <AppText
                style={[layout.errorText, { color: colors.danger }]}
                weight="extrabold"
              >
                {confirmError}
              </AppText>
            )}

            {/* Aceptar términos */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAcceptedTerms((prev) => !prev);
              }}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 24,
                marginBottom: 8,
                gap: 10,
              }}
            >
              {/* Checkbox icon */}
              <Ionicons
                name={acceptedTerms ? "checkbox" : "square-outline"}
                size={22}
                color={acceptedTerms ? colors.primary : colors.textSecondary}
                style={{ marginTop: 1 }}
              />

              {/* Text with clickable links */}
              <AppText
                style={{
                  flex: 1,
                  fontSize: 14,
                  lineHeight: 18,
                  color: colors.textSecondary,
                }}
              >
                Acepto la{" "}
                <AppText
                  weight="extrabold"
                  style={{ color: colors.primary, fontSize: 14 }}
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
                  style={{ color: colors.primary, fontSize: 14 }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/terms-of-use");
                  }}
                >
                  Términos de Uso
                </AppText>
              </AppText>
            </Pressable>

            {/* Botón */}
            <ContinueButtonAuth
              text={loading ? "Creando cuenta..." : "Registrarse"}
              disabled={isInvalid || loading}
              onPress={handleRegister}
            />

            <SeparatorRow />
            {/* Google & Apple side by side */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <GoogleButton mode="register" disabled={!acceptedTerms} />
              <AppleButton mode="register" disabled={!acceptedTerms} />
            </View>
            {!acceptedTerms && (
              <AppText
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: colors.textMuted,
                  marginTop: 6,
                }}
              >
                Aceptá los términos para continuar
              </AppText>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
