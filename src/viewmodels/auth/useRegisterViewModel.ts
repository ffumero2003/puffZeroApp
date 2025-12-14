import { router } from "expo-router";
import { Alert } from "react-native";

import { createProfile } from "@/src/lib/profile";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";

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
  } = useOnboarding();

  async function register({ email, password, nombre }: RegisterPayload) {
    // 1) Crear usuario
    const { data, error } = await signUp(email, password, nombre);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      Alert.alert("Error", "No se pudo obtener el usuario.");
      return;
    }

    // 2) Crear perfil
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
      return;
    }

    if (!profile?.created_at) {
      Alert.alert(
        "Error crítico",
        "El perfil se creó, pero no se pudo obtener la fecha."
      );
      return;
    }

    setProfileCreatedAt(profile.created_at);

    Alert.alert("Cuenta creada", "Revisá tu correo para confirmar tu cuenta.");
    router.push("/(onboarding)/post-signup/step-review");
  }

  return {
    register,
  };
}
