// src/hooks/useUserData.ts
import { DEV_CONFIG, isDevMode } from "@/src/config/dev";
import { getProfileByUserId } from "@/src/lib/profile";
import { useAuth } from "@/src/providers/auth-provider";
import { useEffect, useState } from "react";

/**
 * Hook que retorna los datos completos del usuario
 * Funciona tanto en DEV_MODE (con mock) como en producción (con Supabase)
 */
export function useUserData() {
  const { user, isDevUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user, isDevUser]);

  async function loadUserData() {
    // 🔧 DEV MODE: Retornar datos mock
    if (isDevUser && isDevMode()) {
      console.log("🔧 DEV MODE - Usando profile mock");
      setProfile(DEV_CONFIG.MOCK_USER.profile);
      setLoading(false);
      return;
    }

    // ⚡ PRODUCCIÓN: Cargar desde Supabase
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await getProfileByUserId(user.id);
      
      if (error) {
        console.error("Error cargando profile:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error en useUserData:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    profile,
    loading,
    
    // Helpers útiles
    fullName: profile?.full_name || user?.user_metadata?.full_name || "Usuario",
    email: user?.email || "",
    puffsPerDay: profile?.puffs_per_day || null,
    moneyPerMonth: profile?.money_per_month || null,
    currency: profile?.currency || "CRC",
    goal: profile?.goal || null,
    goalSpeed: profile?.goal_speed || null,
    
    // Flag útil para saber si estamos en dev
    isDevMode: isDevUser,
  };
}
