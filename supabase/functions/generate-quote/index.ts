import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 23.5 hours in milliseconds — matches client-side TTL
const QUOTE_TTL_MS = 23.5 * 60 * 60 * 1000;

// Try models in order. Same resilience strategy as zuffy-chat.
const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

const FALLBACK_QUOTES = [
  "Cada paso cuenta en tu camino.",
  "Tu fuerza de voluntad es más poderosa de lo que crees.",
  "Cada 'no' al vape es un 'sí' a tu mejor versión.",
  "Tu salud te lo agradece cada día que resistes.",
  "Hoy es un buen día para seguir avanzando.",
];

async function callGemini(model: string): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `Eres un coach motivacional especializado en ayudar a personas a dejar de vapear.
Genera UNA frase motivacional corta (máximo 12 palabras) en español latinoamericano.
La frase debe ser positiva, empática, enfocada en el progreso.
Solo responde con la frase, sin comillas.`,
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Genera una frase motivacional para alguien en su proceso de dejar el vape.",
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 60,
          temperature: 0.9,
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.warn(
        `Gemini ${model} returned HTTP ${response.status}:`,
        JSON.stringify(data)
      );
      return null;
    }
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch (e) {
    console.warn(`Gemini ${model} fetch threw:`, e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1️⃣ Check cache (< 23.5 hours old)
    const { data: latestQuote } = await supabase
      .from("daily_quotes")
      .select("quote, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (latestQuote?.quote && latestQuote?.created_at) {
      const age = Date.now() - new Date(latestQuote.created_at).getTime();
      if (age < QUOTE_TTL_MS) {
        console.log(
          "✅ Returning cached quote (age:",
          Math.round(age / 3600000),
          "hrs)"
        );
        return new Response(
          JSON.stringify({ quote: latestQuote.quote, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 2️⃣ Generate new quote from Gemini — try each model in order.
    console.log("🔄 Generating new quote via Gemini");

    let quote: string | null = null;
    for (const model of GEMINI_MODELS) {
      quote = await callGemini(model);
      if (quote) break;
    }

    // 3️⃣ If Gemini failed entirely, use a fallback but DON'T write it to DB.
    // Writing the fallback would cache a generic line for 23.5h, blocking the
    // next real attempt. By NOT saving, the next request retries Gemini.
    if (!quote) {
      const fallback =
        FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      return new Response(
        JSON.stringify({ quote: fallback, cached: false, fallback: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4️⃣ Save real Gemini quote to database
    await supabase
      .from("daily_quotes")
      .insert({ quote, date: new Date().toISOString().split("T")[0] });

    return new Response(JSON.stringify({ quote, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const fallback =
      FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    return new Response(
      JSON.stringify({ quote: fallback, fallback: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});