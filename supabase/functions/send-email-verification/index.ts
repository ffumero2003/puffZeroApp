/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

serve(async (req: Request): Promise<Response> => {
  // 🔐 SEGURIDAD MÍNIMA (OBLIGATORIA)
  const internalKey = req.headers.get("x-internal-key");
  if (internalKey !== Deno.env.get("INTERNAL_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("🔥 Function hit - Email Verification");

  try {
    console.log("➡️ Headers:", Object.fromEntries(req.headers.entries()));

    const body = await req.json();
    console.log("➡️ Body:", body);

    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🔑 ENV VARS
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing env vars" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // 🔄 GENERAR LINK DE SIGNUP (verificación)
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",  // ← CAMBIO: "signup" en vez de "recovery"
      email,
      options: {
        redirectTo: "https://verify.puffzero.lat",  // ← Tu deep link de la app
      },
    });

    if (error || !data?.properties?.action_link) {
      console.error("❌ Error generating link:", error);
      return new Response(JSON.stringify({ error: "Failed to generate link" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const actionLink = data.properties.action_link;
    console.log("🔗 Action link:", actionLink);

    // 📨 ENVIAR EMAIL CON RESEND
    const resend = new Resend(RESEND_API_KEY);

    const emailResult = await resend.emails.send({
      from: "Soporte PuffZero <soporte@puffzero.lat>",
      to: email,
      subject: "Verificá tu cuenta en PuffZero",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #F6F3FF; border-radius: 12px;">
          <div style="text-align:center; margin-bottom: 20px;">
            <img src="https://reset.puffzero.lat/logo-puff-zero.png" alt="PuffZero Logo" style="width: 80px;" />
          </div>

          <h2 style="text-align:center; color:#1F2859;">Verificá tu cuenta</h2>

          <p style="color:#1F2859; font-size:16px; text-align:center;">
            ¡Bienvenido a PuffZero! Hacé clic en el botón para verificar tu email y comenzar tu camino:
          </p>

          <div style="text-align:center; margin: 24px 0;">
            <a href="${actionLink}" style="background:#5974FF; color:#ffffff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
              Verificar mi cuenta
            </a>
          </div>

          <p style="margin-top: 24px; color:#828DBD; font-size: 14px; text-align:center;">
            PuffZero — Sigamos adelante, un paso a la vez.
          </p>
        </div>
      `,
    });

    console.log("✅ Resend result:", emailResult);

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