import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get today's date (UTC)
    const today = new Date().toISOString().split("T")[0];

    // 1️⃣ Check if we already have today's quote
    const { data: existingQuote } = await supabase
      .from("daily_quotes")
      .select("quote")
      .eq("date", today)
      .single();

    if (existingQuote?.quote) {
      console.log("✅ Returning cached quote for", today);
      return new Response(
        JSON.stringify({ quote: existingQuote.quote, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2️⃣ Generate new quote from OpenAI
    console.log("🔄 Generating new quote for", today);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Eres un coach motivacional especializado en ayudar a personas a dejar de vapear. 
Genera UNA frase motivacional corta (máximo 12 palabras) en español latinoamericano.
La frase debe ser positiva, empática, enfocada en el progreso.
Solo responde con la frase, sin comillas.`,
          },
          {
            role: "user",
            content: "Genera una frase motivacional para alguien en su proceso de dejar el vape.",
          },
        ],
        max_tokens: 60,
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    const quote = data.choices?.[0]?.message?.content?.trim() 
      || "Cada paso cuenta en tu camino.";

    // 3️⃣ Save quote to database
    await supabase.from("daily_quotes").insert({ quote, date: today });

    return new Response(
      JSON.stringify({ quote, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ quote: "Tu fuerza de voluntad es más poderosa de lo que crees." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
