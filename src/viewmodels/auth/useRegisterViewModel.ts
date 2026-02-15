// src/viewmodels/auth/useRegisterViewModel.ts
import { createProfile } from "@/src/lib/profile";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { sendVerificationEmail } from "@/src/services/auth-services";
import { areNotificationsEnabled } from "@/src/services/notifications/notification-service";
import { scheduleVerificationReminder } from "@/src/services/notifications/verification-notification";
import { storePendingAccountVerification } from "@/src/services/verification/verification-service";
import { Alert } from "react-native";

type RegisterPayload = {
  email: string;
  password: string;
  nombre: string;
};

export function useRegisterViewModel() {
  const { signUp } = useAuth();
  const {
    puffs_per_day,
    money_per_month,
    currency,
    goal,
    goal_speed,
    why_stopped,
    worries,
    setProfileCreatedAt,
    setName
  } = useOnboarding();


  async function register({ email, password, nombre }: RegisterPayload) {
    const { data, error } = await signUp(email, password, nombre);

    if (error) {
      Alert.alert("Error", error.message);
      return false;
    }

    setName(nombre);
    
    const userId = data?.user?.id;
    if (!userId) {
      Alert.alert("Error", "No se pudo obtener el usuario.");
      return false;
    }

    const { data: profile, error: profileError } = await createProfile({
      user_id: userId,
      full_name: nombre,
      puffs_per_day,
      money_per_month,
      currency,
      goal,
      goal_speed,
      why_stopped,
      worries,
    });

    if (profileError) {
      Alert.alert("Error creando perfil", profileError.message);
      return false;
    }

    if (!profile?.created_at) {
      Alert.alert(
        "Error crítico",
        "El perfil se creó, pero no se pudo obtener la fecha."
      );
      return false;
    }

    setProfileCreatedAt(profile.created_at);

    




    // Alert.alert(
    //   "Verificá tu cuenta",
    //   "Te enviamos un email de verificación. Revisá tu bandeja de entrada para activar tu cuenta.",
    //   [{ text: "OK" }]
    // );


    // Alert.alert(
    //   "¡Cuenta creada!",
    //   "Tu cuenta fue creada exitosamente.",
    //   [{ text: "OK" }]
    // );

    // 📧 Send verification email
    const { error: accountVerificationError } = await sendVerificationEmail(email);
    if (accountVerificationError) {
      console.error("❌ Error sending account verification email:", accountVerificationError);
      // Don't block registration, just warn
    }
    
    // 📝 Store pending account verification
    await storePendingAccountVerification(email);

    // ⏰ Schedule verification reminders for day 3 and day 5
    const notificationsEnabled = await areNotificationsEnabled();
    if (notificationsEnabled) {
      await scheduleVerificationReminder();
    }

return true;
  }

  return {
    register
  };
}