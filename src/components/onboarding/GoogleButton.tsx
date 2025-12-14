import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { components } from "../../../src/styles/components";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/auth-provider";
import AppText from "../AppText";

type GoogleButtonProps = {
  mode: "login" | "register";
};

export default function GoogleButton({ mode }: GoogleButtonProps) {
  const { authInProgress, setAuthInProgress, setAuthFlow } = useAuth();

  const signInWithGoogle = async () => {
    if (authInProgress) return;

    setAuthFlow(mode);          // 🔥 CLAVE
    setAuthInProgress(true);

    const redirectTo = "puffzero://auth/callback";

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: "consent",
            access_type: "offline",
          },
        },
      });

      if (error || !data?.url) throw error;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type !== "success" || !result.url) {
        setAuthInProgress(false);
        return;
      }

      const hash = new URL(result.url).hash;

      const access_token = hash.match(/access_token=([^&]+)/)?.[1];
      const refresh_token = hash.match(/refresh_token=([^&]+)/)?.[1];

      if (!access_token || !refresh_token) {
        throw new Error("Tokens no encontrados");
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) throw sessionError;

      // 🔥 NAVEGACIÓN EXPLÍCITA SEGÚN CONTEXTO
      if (mode === "register") {
        router.replace("/(onboarding)/post-signup/step-review");
      } else {
        router.replace("/(app)/home");
      }

    } catch (err) {
      console.error("❌ Google OAuth error:", err);
      setAuthInProgress(false);
    }
  };

  return (
    <TouchableOpacity
      style={components.googleBtn}
      activeOpacity={0.7}
      disabled={authInProgress}
      onPress={signInWithGoogle}
    >
      {authInProgress ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons name="logo-google" size={20} color="#fff" />
          <AppText weight="semibold" style={components.googleText}>
            Continuar con Google
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
}
