import { supabase, SUPABASE_ANON_KEY } from "../lib/supabase";
const INTERNAL_SECRET = process.env.EXPO_PUBLIC_INTERNAL_SECRET;



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

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = { error: `Error del servidor (${res.status})` };
  }

  if (!res.ok) {
    console.log("EDGE ERROR RESPONSE:", data);
    return { error: { message: data.error ?? "Error enviando correo" } };
  }

  return { error: null };
}

export async function sendVerificationEmail(email: string) {
  const res = await fetch(
    "https://ifjbatvmxeujewbrfjzg.supabase.co/functions/v1/send-email-verification",
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

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = { error: `Error del servidor (${res.status})` };
  }

  if (!res.ok) {
    console.log("VERIFICATION EMAIL ERROR:", data);
    return { error: { message: data.error ?? "Error enviando correo de verificación" } };
  }

  return { error: null };
}

export async function resendEmailChangeVerification(newEmail: string) {
  // Calling updateUser again with the same email resends the verification
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  
  if (error) {
    return { error: { message: error.message } };
  }
  
  return { error: null };
}


// Calls the delete-account edge function to erase all user data + auth account
export async function deleteAccount(userId: string) {
  console.log("🗑️ deleteAccount called with userId:", userId);

  try {
    const res = await fetch(
      "https://ifjbatvmxeujewbrfjzg.supabase.co/functions/v1/delete-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 🔒 Use anon key (same as other edge functions)
          // Security is handled by x-internal-key, not the auth token
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          // 🔐 TU PROPIA SEGURIDAD
          "x-internal-key": INTERNAL_SECRET ?? "",
        },
        body: JSON.stringify({ user_id: userId }),
      }
    );

    console.log("🗑️ Edge function response status:", res.status);

    let data: any;
    try {
      data = await res.json();
    } catch {
      data = { error: `Error del servidor (${res.status})` };
    }

    console.log("🗑️ Edge function response data:", JSON.stringify(data));

    if (!res.ok) {
      console.log("❌ DELETE ACCOUNT ERROR:", data);
      return { error: { message: data.error ?? "Error eliminando cuenta" } };
    }

    console.log("✅ Account deleted successfully");
    return { error: null };
  } catch (fetchError) {
    console.log("❌ FETCH ERROR:", fetchError);
    return { error: { message: "Error de conexión" } };
  }
}
