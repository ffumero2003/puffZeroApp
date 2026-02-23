import { validateEmail } from "@/src/lib/auth/auth.validation";
import { resetPassword } from "@/src/services/auth-services";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";


function getResetErrorMessage(error: any): string {
  const msg = error?.message?.toLowerCase() ?? "";
  if (msg.includes("rate limit") || msg.includes("too many requests"))
    return "Demasiados intentos. Esperá un momento.";
  if (msg.includes("not found") || msg.includes("user not found"))
    return "No encontramos una cuenta con ese correo.";
  if (msg.includes("network"))
    return "Error de conexión. Revisá tu internet.";
  return "No se pudo enviar el enlace. Intentá de nuevo.";
}


export function useForgotPasswordViewModel() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const isInvalid = !email || !!emailError || loading;


  function onEmailChange(value: string) {
    setEmail(value);
    setEmailError(validateEmail(value));
  }

  async function submit() {
  const error = validateEmail(email);
  if (error) {
    setEmailError(error);
    return;
  }

  try {
    setLoading(true);
    const { error: resetError } = await resetPassword(email.trim());

    if (resetError) {
      Alert.alert("Error", getResetErrorMessage(resetError));
      return;
    }

    Alert.alert("Correo enviado", "Revisá tu bandeja de entrada para restablecer tu contraseña.");
    router.back();
  } catch {
    Alert.alert("Error", "Ocurrió un error inesperado. Intentá de nuevo.");
  } finally {
    setLoading(false);
  }
}


  return {
    email,
    emailError,
    loading,
    isInvalid,
    onEmailChange,
    submit,
  };
}
