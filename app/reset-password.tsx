import { layout } from "@/src/styles/layout";
import * as Linking from "expo-linking";
import { router } from "expo-router";
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
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const url = await Linking.getInitialURL();
      console.log("🔗 INITIAL URL:", url);

      if (!url) {
        Alert.alert(
          "Enlace inválido",
          "Pedí un nuevo correo para restablecer tu contraseña."
        );
        return;
      }

      const parsed = Linking.parse(url);
      console.log("🧩 Parsed URL:", parsed);

      const access_token = parsed.queryParams?.access_token;
      const refresh_token = parsed.queryParams?.refresh_token;

      if (!access_token || !refresh_token) {
        Alert.alert("Error", "Tokens no encontrados.");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        Alert.alert("Error", "El enlace expiró o ya fue usado.");
      } else {
        console.log("✅ Recovery session activa");
      }
    };

    init();
  }, []);

  const handleSubmit = async () => {
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
          <OnboardingHeader
            step={0}
            total={11}
            showBack={false}
            showProgress={false}
          />

          <AppText weight="bold" style={layout.title}>
            Crear nueva contraseña
          </AppText>

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
