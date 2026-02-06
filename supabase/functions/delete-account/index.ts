/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

serve(async (req: Request): Promise<Response> => {
  // 🔐 SEGURIDAD MÍNIMA (OBLIGATORIA)
  const internalKey = req.headers.get("x-internal-key");
  if (internalKey !== Deno.env.get("INTERNAL_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("🔥 Function hit - Delete Account");

  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Missing env vars" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Admin client with service role key (can delete users)
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Delete profile data first
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user_id);

    if (profileError) {
      console.error("❌ Error deleting profile:", profileError);
    }

    // Delete puffs data (may already cascade, but explicit is safer)
    const { error: puffsError } = await supabase
      .from("puffs")
      .delete()
      .eq("user_id", user_id);

    if (puffsError) {
      console.error("❌ Error deleting puffs:", puffsError);
    }

    // Delete the auth user (requires service role)
    const { error: authError } = await supabase.auth.admin.deleteUser(user_id);

    if (authError) {
      console.error("❌ Error deleting auth user:", authError);
      return new Response(JSON.stringify({ error: "Failed to delete user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ Account deleted successfully for user:", user_id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🔥 CATCH ERROR:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
