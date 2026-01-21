// src/viewmodels/auth/useRegisterViewModel.ts
import { createProfile } from "@/src/lib/profile";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { sendVerificationEmail } from "@/src/services/auth-services";
import {
  areNotificationsEnabled,
  savePushTokenToProfile,
  scheduleVerificationReminder,
  sendWelcomeNotification
} from "@/src/services/notification-service";
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

    // 🔔 Send welcome notification for new user
    const notificationsEnabled = await areNotificationsEnabled();
    if (notificationsEnabled) {
      console.log("🔔 Sending welcome notification for new user");
      await sendWelcomeNotification();
    }

    savePushTokenToProfile(userId);

    // 📧 Send verification email
    const { error: emailError } = await sendVerificationEmail(email);
    if (emailError) {
      console.error("❌ Error sending verification email:", emailError);
      // Don't block registration, just warn
    }

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

    // ⏰ Schedule verification reminder for 1.5 days
    if (notificationsEnabled) {
      await scheduleVerificationReminder();
    }

return true;
  }

  return {
    register
  };
}