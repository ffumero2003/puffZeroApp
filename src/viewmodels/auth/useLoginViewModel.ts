// useLoginViewModel.ts
import { useState } from "react";
import { Alert } from "react-native";

import {
  validateEmail,
  validatePassword,
} from "@/src/lib/auth/auth.validation";
import { useAuth } from "@/src/providers/auth-provider";

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

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert("Error al iniciar sesión", error.message);
      return false;
    }

    return true;
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
