import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { components } from "../../../src/styles/components";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/auth-provider";
import AppText from "../app-text";

export default function GoogleButton() {
  const { authInProgress, setAuthInProgress } = useAuth();

  const signInWithGoogle = async () => {
    if (authInProgress) return;

    setAuthInProgress(true);

    const redirectTo = "puffzero://auth/callback"; // solo para cerrar browser

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

      // 🔥 EXTRAER TOKENS DEL HASH
      const hash = new URL(result.url).hash;

      const access_token = hash.match(/access_token=([^&]+)/)?.[1];
      const refresh_token = hash.match(/refresh_token=([^&]+)/)?.[1];

      if (!access_token || !refresh_token) {
        throw new Error("Tokens no encontrados");
      }

      // 🔥 SETEAR SESIÓN
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) throw sessionError;


      // ❗ NO navegás acá
      // _layout.tsx decide
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
