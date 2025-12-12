import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

export async function devResetApp() {
  console.log("🧨 DEV RESET — limpiando app");

  // 1️⃣ cerrar sesión
  await supabase.auth.signOut();

  // 2️⃣ borrar TODO el storage local
  await AsyncStorage.clear();

  console.log("✅ DEV RESET COMPLETADO");
}
