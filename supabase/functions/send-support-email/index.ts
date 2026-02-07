/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

serve(async (req: Request): Promise<Response> => {
  // 🔐 SEGURIDAD
  const internalKey = req.headers.get("x-internal-key");
  if (internalKey !== Deno.env.get("INTERNAL_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { from_name, message } = body;

    if (!from_name || !message) {
      return new Response(
        JSON.stringify({ error: "Name and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 📨 Send email via Resend
    const resend = new Resend(RESEND_API_KEY);

    const emailResult = await resend.emails.send({
      from: "Soporte PuffZero <soporte@puffzero.lat>",
      to: "felipefumerom@gmail.com",
      subject: `Soporte PuffZero - ${from_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #F6F3FF; border-radius: 12px;">
          <h2 style="text-align:center; color:#1F2859;">Nuevo mensaje de soporte</h2>

          <div style="background: #fff; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="color:#828DBD; font-size:14px; margin:0;">Nombre</p>
            <p style="color:#1F2859; font-size:16px; margin:4px 0 16px 0; font-weight:600;">${from_name}</p>

            <p style="color:#828DBD; font-size:14px; margin:0;">Mensaje</p>
            <p style="color:#1F2859; font-size:16px; margin:4px 0 0 0;">${message}</p>
          </div>

          <p style="margin-top: 24px; color:#828DBD; font-size: 14px; text-align:center;">
            PuffZero — Soporte
          </p>
        </div>
      `,
    });

    console.log("✅ Support email sent:", emailResult);

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
