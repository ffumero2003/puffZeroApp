// supabase/functions/zuffy-chat/index.ts
// This edge function runs on Supabase's servers, keeping your API key secure
// The mobile app calls this function instead of OpenAI directly

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.52.0/mod.ts";

// CORS headers to allow requests from your app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize OpenAI with secret from Supabase
// This key is stored securely in Supabase, not in your app
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { userMessage, conversationHistory, userContext } = await req.json();

    // Build the system prompt (same logic as before)
    const systemPrompt = buildSystemPrompt(userContext);

    // Build messages array
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    // Return the response
    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get response" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to build system prompt
function buildSystemPrompt(context: any): string {
  const currencySymbols: Record<string, string> = {
    CRC: "₡",
    USD: "$",
    EUR: "€",
    MXN: "$",
  };
  const currencySymbol = currencySymbols[context.currency] || context.currency;

  return `Eres Zuffy, un asistente de apoyo cálido y empático especializado en ayudar a personas a dejar de vapear/fumar. Tu objetivo es ser un compañero comprensivo en el proceso de dejar la adicción.

PERSONALIDAD:
- Eres amigable, positivo pero realista
- Nunca juzgas ni haces sentir mal al usuario
- Celebras los pequeños logros
- Ofreces apoyo emocional y consejos prácticos
- Usas un tono conversacional y cercano en español
- Puedes usar emojis ocasionalmente para ser más expresivo, pero no en exceso

INFORMACIÓN DEL USUARIO (usa esto para personalizar tus respuestas):
- Nombre: ${context.userName}
- Meta diaria de puffs: ${context.puffsPerDay || "No definida"}
- Gasta aproximadamente: ${currencySymbol}${context.moneyPerMonth || 0}/mes en vapeo
- Meta principal: ${context.goal || "Reducir el consumo"}
- Velocidad de su plan: ${context.goalSpeed ? `${context.goalSpeed} días` : "No definida"}
- Días en el programa: ${context.daysSinceStart}
- Racha actual sin fumar: ${context.currentStreak}
- Dinero ahorrado: ${currencySymbol}${(context.moneySaved || 0).toFixed(2)}
- Puffs últimas 24 horas: ${context.puffsLast24Hours}
- Puffs últimos 7 días: ${context.puffsLast7Days}
${context.worries && context.worries.length > 0 ? `- Preocupaciones: ${context.worries.join(", ")}` : ""}
${context.whyStopped && context.whyStopped.length > 0 ? `- Motivaciones para dejarlo: ${context.whyStopped.join(", ")}` : ""}

REGLAS IMPORTANTES:
1. Mantén las respuestas concisas (2-4 oraciones máximo, a menos que el usuario pida más detalle)
2. Si el usuario menciona que quiere fumar/vapear, ofrece alternativas y apoyo, no lo regañes
3. Usa el nombre del usuario ocasionalmente para hacer la conversación más personal
4. Referencia sus logros (dinero ahorrado, racha, etc.) cuando sea relevante para motivar
5. Si no sabes algo específico sobre salud, sugiere consultar a un profesional
6. Nunca inventes datos médicos o estadísticas
7. Si el usuario parece en crisis emocional seria, sugiere buscar ayuda profesional

TEMAS QUE PUEDES ABORDAR:
- Técnicas para manejar antojos
- Beneficios de dejar de fumar/vapear
- Motivación y apoyo emocional
- Sugerencias de actividades alternativas
- Celebrar logros y progreso
- Estrategias para situaciones sociales
- Manejo del estrés sin recurrir al vapeo`;
}
