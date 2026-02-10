// src/hooks/useUserData.ts
import { getProfileByUserId } from "@/src/lib/profile";
import { useAuth } from "@/src/providers/auth-provider";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook que retorna los datos completos del usuario
 * Carga el perfil desde Supabase
 */
export function useUserData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Track whether the initial load has completed.
  // After the first load, refreshProfile() will update data
  // silently (no loading spinner) to avoid UI flashes.
  const hasLoadedOnce = useRef(false);

  const loadUserData = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Only show loading spinner on the very first fetch.
    // Subsequent refreshes update silently in the background.
    if (!hasLoadedOnce.current) {
      setLoading(true);
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
      hasLoadedOnce.current = true;
    }
  }, [user?.id]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    user,
    profile,
    loading,
    // Expose refresh so screens can re-fetch after navigating back
    refreshProfile: loadUserData,

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
