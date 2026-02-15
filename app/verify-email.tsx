// app/verify-email.tsx
import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { supabase } from "@/src/lib/supabase";
import { useThemeColors } from "@/src/providers/theme-provider";
import { cancelVerificationReminder } from "@/src/services/notifications/verification-notification";
import { clearPendingVerification } from "@/src/services/verification/verification-service";
import { layout } from "@/src/styles/layout";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmailScreen() {
  const colors = useThemeColors();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const params = useLocalSearchParams();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const access_token = params.access_token as string | undefined;
    const refresh_token = params.refresh_token as string | undefined;

    if (!access_token || !refresh_token) {
      setStatus("error");
      return;
    }

    verifyEmail(access_token, refresh_token);
  }, [params]);

  async function verifyEmail(access_token: string, refresh_token: string) {
    try {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("❌ Error setting session:", error);
        setStatus("error");
        return;
      }

      // ✅ Limpiar pending verification y reminders
      await clearPendingVerification();
      await cancelVerificationReminder();

      console.log("✅ Verification complete - pending cleared");

      setStatus("success");

      // Wait a moment to show success, then navigate
      setTimeout(() => {
        router.replace(ROUTES.HOME);
      }, 1500);
    } catch (err) {
      console.error("❌ Verification error:", err);
      setStatus("error");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          layout.screenContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        {status === "loading" && (
          <>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText style={{ marginTop: 16 }}>
              Verificando tu cuenta...
            </AppText>
          </>
        )}

        {status === "success" && (
          <>
            <AppText weight="bold" style={{ fontSize: 24, marginBottom: 8 }}>
              ¡Cuenta verificada!
            </AppText>
            <AppText style={{ opacity: 0.7 }}>Entrando a PuffZero...</AppText>
          </>
        )}

        {status === "error" && (
          <>
            <AppText
              weight="bold"
              style={{ fontSize: 24, marginBottom: 8, color: "red" }}
            >
              Error de verificación
            </AppText>
            <AppText style={{ opacity: 0.7, textAlign: "center" }}>
              El enlace puede haber expirado.{"\n"}Intentá registrarte de nuevo.
            </AppText>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
