// src/components/onboarding/GoogleButton.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Vibration,
} from "react-native";

import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { createProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { useTheme } from "@/src/providers/theme-provider";
import { areNotificationsEnabled } from "@/src/services/notifications/notification-service";
import { sendWelcomeBackNotification } from "@/src/services/notifications/welcome-back-notification";
import { components } from "@/src/styles/components";
import * as Haptics from "expo-haptics";

type GoogleButtonProps = {
  mode: "login" | "register";
  disabled?: boolean;
};

export default function GoogleButton({
  mode,
  disabled = false,
}: GoogleButtonProps) {
  const { authInProgress, setAuthInProgress, setAuthFlow } = useAuth();
  const { activeTheme } = useTheme();
  const {
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

      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
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

        // Check if a profile already exists for this user
        // (Google OAuth reuses the same user_id for the same email)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, created_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingProfile) {
          // Profile already exists — update it with the new onboarding data
          console.log(
            "♻️ Profile already exists, updating instead of inserting..."
          );

          const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: full_name || "Usuario Google",
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
              "No pudimos actualizar tu perfil. Intentá de nuevo."
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
            Alert.alert(
              "Error",
              "No pudimos crear tu perfil. Intentá de nuevo."
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
        // ─── Check if this Google user_id already has a profile ───
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (!existingProfile) {
          // No profile for this Google user_id.
          // The user may have registered with email/password before,
          // which created a DIFFERENT user_id for the same email.
          // Try to find the orphaned profile by looking up the old
          // user_id via the email in auth.users (through profiles).
          const userEmail = sessionData?.user?.email;

          if (userEmail) {
            // Look for ANY other auth user with this email that has a profile.
            // We use an RPC or direct query — but since we can't query auth.users
            // from the client, we search profiles by checking all profiles and
            // matching by email is not possible directly.
            //
            // SIMPLEST APPROACH: Find profiles NOT matching this userId,
            // and update the first one that matches the old account.
            // Since Supabase may have linked/merged identities, we look
            // for a profile with a different user_id that belongs to
            // the same email by querying auth identities.

            // Get all identity user IDs linked to this account
            const identities = sessionData?.user?.identities || [];
            const allUserIds = identities
              .map((identity: any) => identity.user_id)
              .filter((id: string) => id !== userId);

            // Also try finding a profile where user_id matches any old identity
            let migrated = false;

            for (const oldId of allUserIds) {
              const { data: oldProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("user_id", oldId)
                .maybeSingle();

              if (oldProfile) {
                // Found the orphaned profile — reassign it to the Google user_id
                console.log(
                  "🔄 Migrating profile from old user_id:",
                  oldId,
                  "→",
                  userId
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
              // No old profile found via identities either.
              // As a last resort, create a minimal profile so the user
              // doesn't see empty data. They can update it in Settings.
              console.log(
                "⚠️ No existing profile found for Google login, creating a new one"
              );
              await createProfile({
                user_id: userId,
                full_name: full_name || "Usuario Google",
              });
            }
          }
        }

        // 🔔 Send welcome back notification for returning user
        if (notificationsEnabled) {
          console.log("🔔 Sending welcome back notification for Google login");

          // Always prefer the name stored in the profile (set during registration)
          // over Google's user_metadata, which may differ from what the user chose.
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

  const btnBg = activeTheme === "dark" ? "#fff" : "#000";
  const btnText = activeTheme === "dark" ? "#000" : "#fff";

  return (
    <TouchableOpacity
      style={[
        components.googleBtn,
        { backgroundColor: btnBg },
        disabled && { opacity: 0.5 }, // dim when disabled
      ]}
      activeOpacity={0.7}
      disabled={authInProgress}
      onPress={() => {
        // If externally disabled (terms not accepted), vibrate and bail
        if (disabled) {
          Vibration.vibrate(30);
          return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        signInWithGoogle();
      }}
    >
      {authInProgress ? (
        <ActivityIndicator color={btnText} />
      ) : (
        <>
          <Ionicons name="logo-google" size={20} color={btnText} />
          <AppText
            weight="semibold"
            style={[components.googleText, { color: btnText }]}
          >
            Continuar con Google
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
}
