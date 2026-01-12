import type { TablesInsert, TablesUpdate } from "./database";
import { supabase } from "./supabase";

/**
 * Crear perfil del usuario después del registro
 * OBLIGATORIO: profile.user_id
 */
export async function createProfile(
  profile: TablesInsert<"profiles">
) {
  if (!profile.user_id) {
    console.log("❌ createProfile: user_id es obligatorio", profile);
    throw new Error("user_id missing in createProfile");
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.log("❌ Error creando profile:", error);
    return { data: null, error };
  }

  console.log("✅ Profile creado correctamente:", data);
  return { data, error: null };
}

/**
 * Obtener perfil por user_id
 * Returns null for data if no profile found (not an error)
 */
export async function getProfileByUserId(userId: string) {
  if (!userId) {
    throw new Error("userId requerido para getProfileByUserId");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("❌ Error obteniendo profile:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Actualizar perfil
 * Returns null for data if no profile found to update
 */
export async function updateProfile(
  userId: string,
  updates: TablesUpdate<"profiles">
) {
  if (!userId) {
    throw new Error("userId requerido para updateProfile");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) {
    console.log("❌ Error actualizando profile:", error);
    return { data: null, error };
  }

  if (data) {
    console.log("✅ Profile actualizado:", data);
  }
  
  return { data, error: null };
}
