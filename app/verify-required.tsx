// app/verify-required.tsx
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { useThemeColors } from "@/src/providers/theme-provider";
import { supabase } from "@/src/lib/supabase";
import { sendVerificationEmail } from "@/src/services/auth-services";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyRequiredScreen() {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      Alert.alert("Error", "No se pudo obtener tu email.");
      setLoading(false);
      return;
    }

    const { error } = await sendVerificationEmail(user.email);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Email enviado",
        "Revisá tu bandeja de entrada y hacé clic en el enlace de verificación."
      );
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    
    // Refresh the session to get updated user data
    const { data: { user }, error } = await supabase.auth.getUser();
    
    setChecking(false);

    if (error) {
      Alert.alert("Error", "No se pudo verificar tu estado.");
      return;
    }

    if (user?.email_confirmed_at) {
      Alert.alert("¡Verificado!", "Tu cuenta ha sido verificada.", [
        { text: "Continuar", onPress: () => router.replace("/(app)/home") }
      ]);
    } else {
      Alert.alert(
        "Aún no verificado",
        "Tu email todavía no está verificado. Revisá tu bandeja de entrada."
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={layout.screenContainer}>
        <View>
          <OnboardingHeader showBack={false} showProgress={false} />

          <View style={layout.content}>
            <AppText weight="bold" style={layout.title}>
              Verificá tu cuenta
            </AppText>

            <AppText style={[layout.subtitle, { marginTop: 12 }]}>
              Tu período de prueba terminó. Para no perder tu progreso, verificá tu email.
            </AppText>

            <View style={{ 
              backgroundColor: "#FFF3CD", 
              padding: 16, 
              borderRadius: 12, 
              marginTop: 24 
            }}>
              <AppText weight="semibold" style={{ color: "#856404", fontSize: 14 }}>
                ⚠️ Si no verificás tu cuenta, podrías perder todo tu progreso registrado.
              </AppText>
            </View>
          </View>
        </View>

        <View style={layout.bottomButtonContainer}>
          <ContinueButton
            text={loading ? "Enviando..." : "Reenviar email de verificación"}
            onPress={handleResendEmail}
            disabled={loading}
          />
          
          <ContinueButton
            text={checking ? "Verificando..." : "Ya verifiqué mi cuenta"}
            onPress={handleCheckVerification}
            disabled={checking}
            style={{ 
              marginTop: 12, 
              backgroundColor: "transparent", 
              borderWidth: 2, 
              borderColor: colors.primary 
            }}
            textStyle={{ color: colors.primary }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}