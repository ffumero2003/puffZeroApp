import { layout } from "@/src/styles/layout";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import OnboardingHeader from "@/src/components/onboarding/onboarding-header";
import AppText from "../src/components/app-text";
import ContinueButton from "../src/components/onboarding/continue-button";
import UnderlineInput from "../src/components/onboarding/underline-input";
import { supabase } from "../src/lib/supabase";

export default function ResetPasswordScreen() {
  const { token: rawToken } = useLocalSearchParams();
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔥 Activar sesión de recuperación */
  useEffect(() => {
    const activateRecovery = async () => {
      if (!token) return;

      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      if (error) {
        console.log("Error al activar sesión de recuperación:", error);
      } else {
        console.log("Sesión de recuperación activada.");
      }
    };

    activateRecovery();
  }, [token]);

  /* 🔥 Manejo de submit */
  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Error", "Token inválido.");
      return;
    }

    if (!password || !confirm) {
      Alert.alert("Error", "Completá ambos campos.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Listo", "Tu contraseña fue actualizada.");
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={layout.screenContainer}>

          {/* 🔵 HEADER SOLO PARA ESPACIO (sin back, sin progress) */}
          <OnboardingHeader
            step={0}
            total={11}
            showBack={false}
            showProgress={false}
          />

          {/* 🔵 TÍTULO */}
          <AppText weight="bold" style={layout.title}>
            Crear nueva contraseña
          </AppText>

          {/* 🟣 INPUTS */}
          <View style={{ width: "100%", marginTop: 30 }}>
            <UnderlineInput
              placeholder="Nueva contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <UnderlineInput
              placeholder="Confirmar contraseña"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              style={{ marginTop: 16 }}
            />
          </View>

          {/* 🟢 BOTÓN ABAJO (sube con teclado) */}
          <View style={{ width: "100%", marginTop: "auto" }}>
            <ContinueButton
              text={loading ? "Actualizando..." : "Actualizar contraseña"}
              onPress={handleSubmit}
              disabled={loading}
              style={layout.bottomButtonContainer}
            />
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

}
