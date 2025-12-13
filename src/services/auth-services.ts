import { supabase, SUPABASE_ANON_KEY } from "../lib/supabase";
const INTERNAL_SECRET = "puffzero_internal_9f3KxP2mLQa8Zx72dW0HcR"; 


export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}

export async function resetPassword(email: string) {
  const res = await fetch(
    "https://ifjbatvmxeujewbrfjzg.supabase.co/functions/v1/send-reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 🔒 SUPABASE EDGE GUARD (OBLIGATORIO)
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // 🔐 TU PROPIA SEGURIDAD
        "x-internal-key": INTERNAL_SECRET,
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("EDGE ERROR RESPONSE:", data);
    return { error: { message: data.error ?? "Error enviando correo" } };
  }

  return { error: null };
}