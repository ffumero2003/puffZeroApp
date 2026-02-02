// src/components/onboarding/GoogleButton.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";

import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { createProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import {
    areNotificationsEnabled,
    savePushTokenToProfile,
    sendWelcomeBackNotification,
    sendWelcomeNotification
} from "@/src/services/notifications/notification-service";
import { components } from "@/src/styles/components";


type GoogleButtonProps = {
  mode: "login" | "register";
};

export default function GoogleButton({ mode }: GoogleButtonProps) {
  const { authInProgress, setAuthInProgress, setAuthFlow } = useAuth();
  const { 
    setName, 
    puffs_per_day,
    money_per_month,
    currency,
    goal,
    goal_speed,
    why_stopped,
    worries,
    setProfileCreatedAt
  } = useOnboarding();

  const signInWithGoogle = async () => {
    if (authInProgress) return;

    setAuthFlow(mode);
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

      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) throw sessionError;

      const full_name = sessionData?.user?.user_metadata?.full_name;
      const userId = sessionData?.user?.id;
      const firstName = full_name?.trim().split(" ")[0];

      if (full_name && mode === "register") {
        setName(full_name);
      }

      // 🔔 NOTIFICATION LOGIC
      const notificationsEnabled = await areNotificationsEnabled();

      if (mode === "register" && userId) {
        console.log("📝 Creando perfil para usuario de Google...");

        const { data: profile, error: profileError } = await createProfile({
          user_id: userId,
          full_name: full_name || "Usuario Google",
          puffs_per_day,
          money_per_month,
          currency,
          goal,
          goal_speed,
          why_stopped,
          worries,
        });

        if (profileError) {
          console.error("❌ Error creando perfil:", profileError);
          Alert.alert("Error", "No pudimos crear tu perfil. Intentá de nuevo.");
          setAuthInProgress(false);
          return;
        }

        if (profile?.created_at) {
          console.log("✅ Perfil creado con created_at:", profile.created_at);
          setProfileCreatedAt(profile.created_at);
        }

        // 🔔 Send welcome notification for new user
        if (notificationsEnabled) {
          console.log("🔔 Sending welcome notification for new Google user");
          await sendWelcomeNotification();
        }

        // 📲 Save push token to profile for daily notifications
        savePushTokenToProfile(userId);
      } else if (mode === "login" && userId) {
        // 🔔 Send welcome back notification for returning user
        if (notificationsEnabled) {
          console.log("🔔 Sending welcome back notification for Google login");
          await sendWelcomeBackNotification(firstName);
        }
        // 📲 Save push token to profile for daily notifications
        savePushTokenToProfile(userId);
      }

      // 🔥 NAVEGACIÓN EXPLÍCITA SEGÚN CONTEXTO
      if (mode === "register") {
        router.replace(ROUTES.POST_SIGNUP_REVIEW);
      } else {
        router.replace(ROUTES.HOME);
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