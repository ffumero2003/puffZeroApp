// src/components/onboarding/AppleButton.tsx
// Sign in with Apple button — follows the same pattern as GoogleButton.tsx
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity,
  Vibration,
} from "react-native";

import { ROUTES } from "@/src/constants/routes";
import { createProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { useTheme } from "@/src/providers/theme-provider";
import { areNotificationsEnabled } from "@/src/services/notifications/notification-service";
import { sendWelcomeBackNotification } from "@/src/services/notifications/welcome-back-notification";
import { components } from "@/src/styles/components";

type AppleButtonProps = {
  mode: "login" | "register";
  disabled?: boolean;
};

export default function AppleButton({
  mode,
  disabled = false,
}: AppleButtonProps) {
  const { authInProgress, setAuthInProgress, setAuthFlow } = useAuth();
  const { activeTheme } = useTheme();
  const {
    name,
    setName,
    puffs_per_day,
    money_per_month,
    currency,
    goal,
    goal_speed,
    why_stopped,
    worries,
    setProfileCreatedAt,
  } = useOnboarding();

  // Apple Sign In is only available on iOS
  if (Platform.OS !== "ios") return null;

  const signInWithApple = async () => {
    if (authInProgress) return;

    setAuthFlow(mode);
    setAuthInProgress(true);

    try {
      // 1. Request credentials from Apple's native dialog
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No se recibió el token de Apple");
      }

      // 2. Pass the Apple identity token to Supabase
      const { data: sessionData, error: sessionError } =
        await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        });

      if (sessionError) throw sessionError;

      const userId = sessionData?.user?.id;

      // Apple only returns the name on the FIRST sign-in, so grab it here
      const appleName = credential.fullName
        ? [credential.fullName.givenName, credential.fullName.familyName]
            .filter(Boolean)
            .join(" ")
        : null;

      // Fall back to Supabase user_metadata if Apple didn't provide a name
      let full_name =
        appleName ||
        sessionData?.user?.user_metadata?.full_name ||
        name ||
        null;

      // If still no name and registering, ask the user
      if (!full_name && mode === "register") {
        full_name = await new Promise<string | null>((resolve) => {
          Alert.prompt(
            "¿Cómo te llamás?",
            "Apple no compartió tu nombre. Ingresalo para personalizar tu experiencia.",
            [
              {
                text: "Continuar",
                onPress: (value) => resolve(value?.trim() || null),
              },
            ],
            "plain-text",
            "",
            "default",
          );
        });
      }

      const firstName = full_name?.trim().split(" ")[0];

      if (full_name && mode === "register") {
        setName(full_name);
      }

      // 🔔 NOTIFICATION LOGIC
      const notificationsEnabled = await areNotificationsEnabled();

      if (mode === "register" && userId) {
        console.log("📝 Creando perfil para usuario de Apple...");

        // Check if a profile already exists (Apple OAuth reuses the same user_id)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, created_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingProfile) {
          // Profile already exists — update it with the new onboarding data
          console.log(
            "♻️ Profile already exists, updating instead of inserting...",
          );

          const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: full_name || "Usuario Apple",
              puffs_per_day,
              money_per_month,
              currency,
              goal,
              goal_speed,
              why_stopped,
              worries,
            })
            .eq("user_id", userId)
            .select()
            .single();

          if (updateError) {
            console.error("❌ Error actualizando perfil:", updateError);
            Alert.alert(
              "Error",
              "No pudimos actualizar tu perfil. Intentá de nuevo.",
            );
            setAuthInProgress(false);
            return;
          }

          if (updatedProfile?.created_at) {
            setProfileCreatedAt(updatedProfile.created_at);
          }
        } else {
          // No profile exists — create a new one
          const { data: profile, error: profileError } = await createProfile({
            user_id: userId,
            full_name: full_name || "Usuario Apple",
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
            Alert.alert(
              "Error",
              "No pudimos crear tu perfil. Intentá de nuevo.",
            );
            setAuthInProgress(false);
            return;
          }

          if (profile?.created_at) {
            console.log("✅ Perfil creado con created_at:", profile.created_at);
            setProfileCreatedAt(profile.created_at);
          }
        }
      } else if (mode === "login" && userId) {
        // Check if this Apple user already has a profile
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!existingProfile) {
          // No profile found for this Apple ID.
          // Check if there's a profile linked via identities (account migration)
          const identities = sessionData?.user?.identities || [];
          const otherUserIds = identities
            .map((identity: any) => identity.user_id)
            .filter((id: string) => id !== userId);

          let migrated = false;

          for (const oldId of otherUserIds) {
            const { data: oldProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("user_id", oldId)
              .maybeSingle();

            if (oldProfile) {
              console.log(
                "🔄 Migrating profile from old user_id:",
                oldId,
                "→",
                userId,
              );
              await supabase
                .from("profiles")
                .update({ user_id: userId })
                .eq("user_id", oldId);
              migrated = true;
              break;
            }
          }

          if (!migrated) {
            // No existing profile found — this Apple ID has no account
            // Sign out and tell user to use their original sign-in method
            await supabase.auth.signOut();
            Alert.alert(
              "Cuenta no encontrada",
              "No encontramos una cuenta con este Apple ID. Si ya tenés una cuenta, iniciá sesión con Google o email. Si sos nuevo, registrate primero.",
            );
            setAuthInProgress(false);
            return;
          }
        }

        // 🔔 Send welcome back notification for returning user
        if (notificationsEnabled) {
          console.log("🔔 Sending welcome back notification for Apple login");

          let notifName = firstName;

          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", userId)
            .maybeSingle();

          if (profileData?.full_name) {
            notifName = profileData.full_name.trim().split(" ")[0];
          }

          await sendWelcomeBackNotification(notifName);
        }
      }

      // 🔥 NAVIGATE BASED ON CONTEXT
      if (mode === "register") {
        router.replace(ROUTES.POST_SIGNUP_REVIEW);
      } else {
        router.replace(ROUTES.HOME);
      }
    } catch (err: any) {
      // User cancelled the Apple dialog — don't show an error
      if (err.code === "ERR_REQUEST_CANCELED") {
        console.log("Apple sign-in cancelled by user");
      } else {
        console.error("❌ Apple OAuth error:", err);
      }
      setAuthInProgress(false);
    }
  };

  // Apple's official style: black bg + white text (light mode),
  // white bg + black text (dark mode)
  const btnBg = activeTheme === "dark" ? "#fff" : "#000";
  const btnText = activeTheme === "dark" ? "#000" : "#fff";

  return (
    <TouchableOpacity
      style={[
        components.googleBtn,
        {
          backgroundColor: btnBg,
          width: undefined,
          flex: 1,
        },
        disabled && { opacity: 0.5 },
      ]}
      activeOpacity={0.7}
      disabled={authInProgress}
      onPress={() => {
        if (disabled) {
          Vibration.vibrate(30);
          return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        signInWithApple();
      }}
    >
      {authInProgress ? (
        <ActivityIndicator color={btnText} />
      ) : (
        <>
          <Ionicons name="logo-apple" size={28} color={btnText} />
        </>
      )}
    </TouchableOpacity>
  );
}
