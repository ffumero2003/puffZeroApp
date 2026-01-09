// src/hooks/useUserData.ts
import { getProfileByUserId } from "@/src/lib/profile";
import { useAuth } from "@/src/providers/auth-provider";
import { useEffect, useState } from "react";

/**
 * Hook que retorna los datos completos del usuario
 * Carga el perfil desde Supabase
 */
export function useUserData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  async function loadUserData() {
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
  };
}
