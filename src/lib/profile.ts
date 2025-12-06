import type { TablesInsert } from "./database";
import { supabase } from "./supabase";

export async function createProfile(profile: TablesInsert<"profiles">) {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  return { data, error };
}
