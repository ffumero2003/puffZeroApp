import { validateEmail } from "@/src/lib/auth/auth.validation";
import { resetPassword } from "@/src/services/auth-services";
import { router } from "expo-router";
import { useState } from "react";

export function useForgotPasswordViewModel() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const { error: resetError } = await resetPassword(email.trim());
    setLoading(false);

    if (resetError) {
      alert(resetError.message);
      return;
    }

    alert("Te enviamos un enlace para restablecer tu contraseña.");
    router.back();
  }

  return {
    email,
    emailError,
    loading,
    onEmailChange,
    submit,
  };
}
