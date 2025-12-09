import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import AppText from "../../src/components/app-text";
import KeepGoingButton from "../../src/components/onboarding/keep-going-button";
import UnderlineInput from "../../src/components/onboarding/underline-input";
import { Colors } from "../../src/constants/theme";
import { resetPassword } from "../../src/services/auth-services";

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={28} color={Colors.light.text} />
        </TouchableOpacity>

        {/* Title */}
        <AppText weight="bold" style={styles.title}>
          ¿Olvidaste tu contraseña?
        </AppText>

        {/* Subtitle */}
        <AppText style={styles.subtitle}>
          Ingresá tu correo y te enviaremos un enlace{"\n"}para restablecerla.
        </AppText>

        {/* Email Input */}
        <UnderlineInput
          placeholder="Correo"
          value={email}
          onChangeText={validateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Error Text */}
        {emailError ? (
          <AppText style={styles.errorText} weight="extrabold">{emailError}</AppText>
        ) : null}

        {/* Button */}
        <View style={{ marginTop: "auto", marginBottom: 40 }}>
          <KeepGoingButton
            text={loading ? "Enviando..." : "Restablecer contraseña"}
            onPress={handleReset}
          />
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
    paddingTop: 50,
  },

  backBtn: {
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.light.textMuted,
    marginBottom: 30,
    lineHeight: 22,
  },

  errorText: {
    color: Colors.light.danger,
    fontSize: 16,
    marginTop: 4,
    marginLeft: 4,
  },
});
