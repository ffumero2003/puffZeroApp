// useResetPasswordViewModel.ts
import { isDevMode } from "@/src/config/dev";
import { ROUTES } from "@/src/constants/routes";
import { supabase } from "@/src/lib/supabase";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
export function useResetPasswordViewModel() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); 

  const params = useLocalSearchParams();
  const didInit = useRef(false);

  const recoveryUsed = useRef(false);


  async function hydrateSessionFromUrl(url: string) {
    // 🔕 Recovery ya consumido → salir sin alertas
    if (recoveryUsed.current) {
      router.replace(ROUTES.ONBOARDING);
      return false;
    }

    const parsed = Linking.parse(url);

    const access_token = parsed.queryParams?.access_token as string | undefined;
    const refresh_token = parsed.queryParams?.refresh_token as string | undefined;

    if (!access_token || !refresh_token) {
      if(!isDevMode()) {
        router.replace(ROUTES.ONBOARDING);
        return false;
      }
      return true;
    }

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      router.replace(ROUTES.ONBOARDING);
      return false;
    }

    setReady(true);
    return true;
  }




  useEffect(() => {
  
    if (didInit.current) return;
    didInit.current = true;

    const access = params.access_token as string | undefined;
    const refresh = params.refresh_token as string | undefined;

   

    if (!access || !refresh) {
      if (!isDevMode()) {
        router.replace(ROUTES.ONBOARDING);
      }
      return;
    }

   

    hydrateSessionFromUrl(
      `puffzero://reset-password?access_token=${access}&refresh_token=${refresh}`
    );

    const sub = Linking.addEventListener("url", ({ url }) => {
      hydrateSessionFromUrl(url);
    });

    return () => sub.remove();
  }, [params]);


  async function submit() {
    if (!password || !confirm) {
      Alert.alert("Error", "Completá ambos campos.");
      return false;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return false;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      if (
        error.message.toLowerCase().includes("different") ||
        error.message.toLowerCase().includes("old password")
      ) {
        Alert.alert(
          "Contraseña inválida",
          "La nueva contraseña no puede ser igual a la anterior."
        );
      } else {
        Alert.alert("Error", error.message);
      }
      return false;
    }

    // Mark recovery as used BEFORE signing out
    recoveryUsed.current = true;

    // Sign out the recovery session and WAIT for it to fully complete
    await supabase.auth.signOut();

    // Also explicitly clear any persisted session from AsyncStorage
    // This ensures no stale recovery session survives app restart
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    await AsyncStorage.removeItem("sb-ifjbatvmxeujewbrfjzg-auth-token");

    setLoading(false);

    Alert.alert("Listo", "Tu contraseña fue actualizada.");
    return true;
  }




  return {
    password,
    confirm,
    loading,
    setPassword,
    setConfirm,
    submit,
    ready,
  };
}
