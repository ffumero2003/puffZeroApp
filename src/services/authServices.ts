import { supabase } from "../lib/supabase";

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// 🔹 Enviar correo de reset password
export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
  // Si quisieras especificar adónde redirige el link:
  // return supabase.auth.resetPasswordForEmail(email, {
  //   redirectTo: "http://localhost:19000",
  // });
}
