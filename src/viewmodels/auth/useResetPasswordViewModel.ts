import { supabase } from "@/src/lib/supabase";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export function useResetPasswordViewModel() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams();
  const didInit = useRef(false);

  async function hydrateSessionFromUrl(url: string) {
    const parsed = Linking.parse(url);

    const access_token = parsed.queryParams?.access_token as string | undefined;
    const refresh_token = parsed.queryParams?.refresh_token as string | undefined;

    if (!access_token || !refresh_token) {
      Alert.alert("Error", "El enlace no es válido.");
      return;
    }

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      Alert.alert("Error", "El enlace expiró o ya fue usado.");
    }
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const access = params.access_token as string | undefined;
    const refresh = params.refresh_token as string | undefined;

    if (access && refresh) {
      hydrateSessionFromUrl(
        `puffzero://reset-password?access_token=${access}&refresh_token=${refresh}`
      );
    } else {
      Linking.getInitialURL().then((url) => {
        if (url) hydrateSessionFromUrl(url);
      });
    }

    const sub = Linking.addEventListener("url", ({ url }) => {
      hydrateSessionFromUrl(url);
    });

    return () => sub.remove();
  }, [params]);

  async function submit() {
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
  }

  return {
    password,
    confirm,
    loading,
    setPassword,
    setConfirm,
    submit,
  };
}
