// useLoginViewModel.ts
import { useState } from "react";
import { Alert } from "react-native";

import {
  validateEmail,
  validatePassword,
} from "@/src/lib/auth/auth.validation";
import { useAuth } from "@/src/providers/auth-provider";

function getLoginErrorMessage(error: any): string {
  const msg = error?.message?.toLowerCase() ?? "";
  if (msg.includes("invalid login credentials"))
    return "Correo o contraseña incorrectos.";
  if (msg.includes("email not confirmed"))
    return "Confirmá tu correo antes de iniciar sesión.";
  if (msg.includes("rate limit") || msg.includes("too many requests"))
    return "Demasiados intentos. Esperá un momento.";
  if (msg.includes("network"))
    return "Error de conexión. Revisá tu internet.";
  return "No se pudo iniciar sesión. Intentá de nuevo.";
}


export function useLoginViewModel() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const onEmailChange = (v: string) => {
    setEmail(v);
    setEmailError(validateEmail(v));
  };

  const onPasswordChange = (v: string) => {
    setPassword(v);
    setPasswordError(validatePassword(v));
  };

  const submit = async () => {
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);

  setEmailError(emailErr);
  setPasswordError(passErr);

  if (emailErr || passErr) return false;

  try {
    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      Alert.alert("Error al iniciar sesión", getLoginErrorMessage(error));
      return false;
    }

    return true;
  } catch {
    Alert.alert("Error", "Ocurrió un error inesperado. Intentá de nuevo.");
    return false;
  } finally {
    setLoading(false);
  }
};


  const isInvalid =
    !email || !password || !!emailError || !!passwordError || loading;

  return {
    email,
    password,
    emailError,
    passwordError,
    loading,
    isInvalid,
    onEmailChange,
    onPasswordChange,
    submit,
  };
}
