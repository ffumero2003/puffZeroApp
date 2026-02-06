/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

serve(async (req: Request): Promise<Response> => {
  // 🔐 Security check
  const internalKey = req.headers.get("x-internal-key");
  if (internalKey !== Deno.env.get("INTERNAL_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  

  try {
    const body = await req.json();
    console.log("➡️ Body:", body);

    const { email, newEmail } = body;

    if (!email || !newEmail) {
      return new Response(JSON.stringify({ error: "Email and newEmail are required" }), {
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

    // 🔄 Generate magic link for email change
    // Using magiclink type which will set email_confirmed_at when clicked
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: newEmail,  // Generate link for the NEW email
      options: {
        redirectTo: "https://verify.puffzero.lat",
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
    console.log("🔗 Email change verification link generated");

    // 📨 Send email with Resend
    const resend = new Resend(RESEND_API_KEY);

    const emailResult = await resend.emails.send({
      from: "Soporte PuffZero <soporte@puffzero.lat>",
      to: newEmail,
      subject: "Confirmá tu nuevo email en PuffZero",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #F6F3FF; border-radius: 12px;">
          <div style="text-align:center; margin-bottom: 20px;">
            <img src="https://reset.puffzero.lat/logo-puff-zero.png" alt="PuffZero Logo" style="width: 80px;" />
          </div>

          <h2 style="text-align:center; color:#1F2859;">Confirmá tu nuevo email</h2>

          <p style="color:#1F2859; font-size:16px; text-align:center;">
            Solicitaste cambiar tu email a esta dirección. Hacé clic en el botón para confirmar:
          </p>

          <div style="text-align:center; margin: 24px 0;">
            <a href="${actionLink}" style="background:#5974FF; color:#ffffff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
              Confirmar nuevo email
            </a>
          </div>

          <p style="margin-top: 16px; color:#828DBD; font-size: 13px; text-align:center;">
            Si no solicitaste este cambio, podés ignorar este email.
          </p>

          <p style="margin-top: 24px; color:#828DBD; font-size: 12px; text-align:center;">
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
