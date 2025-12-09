/// <reference types="jsr:@supabase/functions-js/edge-runtime.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface ResetRequest {
  email: string;
}

serve(async (req: Request): Promise<Response> => {
  try {
    const { email } = (await req.json()) as ResetRequest;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: "puffzero://reset-password?token=placeholder",
      },
    });

    console.log("GENERATED LINK DATA:", JSON.stringify(data, null, 2));

    if (error) {
      console.log("GENERATE LINK ERROR:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const props = data?.properties;

    let token =
      props?.recovery_token ??
      props?.hashed_token ??
      null;

    if (!token && props?.action_link) {
      const url = new URL(props.action_link);
      token =
        url.searchParams.get("token") ??
        url.searchParams.get("token_hash");
    }

    console.log("TOKEN FINAL:", token);

    if (!token) {
      return new Response(JSON.stringify({ error: "Token not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deepLink = `puffzero://reset-password?token=${token}`;

    // ------------------------------
    // SEND EMAIL (WITH LOGS)
    // ------------------------------

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(resendApiKey);

    console.log("SENDING EMAIL...");

    try {
      const result = await resend.emails.send({
      from: "Soporte PuffZero <soporte@puffzero.lat>",
      to: email,
      subject: "Restablecer tu contraseña",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 480px;
          margin: 0 auto;
          padding: 24px;
          background: #F6F3FF;
          border-radius: 12px;
        ">

          <!-- LOGO -->
          <div style="text-align:center; margin-bottom: 20px;">
            <img 
              src="https://ifjbatvmxeujewbrfjzg.supabase.co/storage/v1/object/public/assets/logo.png"
              alt="PuffZero Logo"
              style="width: 80px; height: auto;"
            />
          </div>

          <h2 style="
            text-align:center;
            color:#1F2859;
            font-weight:700;
            margin-bottom: 16px;
          ">
            Restablecer contraseña
          </h2>

          <p style="
            color:#1F2859;
            font-size:16px;
            margin-bottom: 24px;
            text-align:center;
          ">
            Usá el siguiente enlace para crear una nueva contraseña:
          </p>

          <div style="text-align:center; margin: 24px 0;">
            <a 
              href="${deepLink}"
              style="
                background:#5974FF;
                color:#ffffff;
                padding:12px 24px;
                border-radius:8px;
                text-decoration:none;
                font-weight:600;
                display:inline-block;
              "
            >
              Restablecer contraseña
            </a>
          </div>

          <p style="
            margin-top: 24px;
            color:#828DBD;
            font-size: 14px;
            text-align:center;
          ">
            PuffZero — Sigamos adelante, un paso a la vez.
          </p>

        </div>
      `
    });


      console.log("EMAIL SENT RESULT:", JSON.stringify(result, null, 2));
    } catch (err) {
      console.log("EMAIL SEND ERROR:", err);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: unknown) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
