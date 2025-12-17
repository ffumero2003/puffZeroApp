// useRegisterViewModel.ts
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

    Alert.alert("Cuenta creada", "Revisá tu correo para confirmar tu cuenta.");
    return true;
  }

  return {
    register
    
  };
}
