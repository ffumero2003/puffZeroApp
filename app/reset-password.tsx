import { layout } from "@/src/styles/layout";
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

import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function ResetPasswordScreen() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const params = useLocalSearchParams();
    const didInit = useRef(false);

    const hydrateSessionFromUrl = async (url: string) => {
      // console.log("🔗 URL RECEIVED:", url);

      const parsed = Linking.parse(url);
      // console.log("🧩 Parsed URL:", parsed);

      // ✅ Ya no depende de hash. Debe venir en query.
      const access_token = parsed.queryParams?.access_token as string | undefined;
      const refresh_token = parsed.queryParams?.refresh_token as string | undefined;

      if (!access_token || !refresh_token) {
        Alert.alert("Error", "Tokens no encontrados.");
        return;
      }

      const { error } = await supabase.auth.setSession({ access_token, refresh_token });

      if (error) {
        // console.log("❌ setSession error:", error);
        Alert.alert("Error", "El enlace expiró o ya fue usado.");
        return;
      }

      // console.log("✅ Recovery session activa");
    };

    useEffect(() => {
      if (didInit.current) return;
      didInit.current = true;

      // 1) Intentar con params del router (ideal si Expo Router ya parseó)
      const access = params.access_token as string | undefined;
      const refresh = params.refresh_token as string | undefined;

      if (access && refresh) {
        const url = `puffzero://reset-password?access_token=${encodeURIComponent(access)}&refresh_token=${encodeURIComponent(refresh)}`;
        hydrateSessionFromUrl(url);
      } else {
        // 2) Cold start
        Linking.getInitialURL().then((url) => {
          // console.log("🔗 INITIAL URL:", url);
          if (url) hydrateSessionFromUrl(url);
        });
      }

      // 3) Warm start / cuando iOS entrega el link por evento
      const sub = Linking.addEventListener("url", ({ url }) => {
        hydrateSessionFromUrl(url);
      });

      return () => sub.remove();
    }, [params]);

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
          <View>
            {/* 🚫 Header sin progress */}
            <OnboardingHeader
              step={0}
              total={11}
              showBack={false}
              showProgress={false}
            />

            {/* 🔵 TÍTULO */}
            <View style={layout.content}>
              <AppText weight="bold" style={layout.title}>
                Crear nueva contraseña
              </AppText>

              <AppText style={layout.subtitle}>
                Ingresá y confirmá tu nueva contraseña para continuar.
              </AppText>
            </View>

            {/* 🟣 INPUTS */}
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

          {/* 🟢 BOTÓN ABAJO */}
          <ContinueButton
            text={loading ? "Actualizando..." : "Actualizar contraseña"}
            onPress={handleSubmit}
            disabled={loading}
            style={layout.bottomButtonContainer}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );

}
