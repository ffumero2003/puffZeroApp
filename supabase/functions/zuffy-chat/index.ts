// supabase/functions/zuffy-chat/index.ts
// Calls Google Gemini (free tier) — keeps API key off the device.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// Try models in this order. If one returns 503 / no text, the next is tried.
// gemini-2.5-flash-lite is cheapest; gemini-2.5-flash is on a separate
// availability pool, so when lite is overloaded, flash often works.
const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callGemini(
  model: string,
  body: unknown
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      console.warn(
        `Gemini ${model} returned HTTP ${response.status}:`,
        JSON.stringify(data)
      );
      return null;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    if (!text) {
      console.warn(
        `Gemini ${model} returned no text:`,
        JSON.stringify(data)
      );
    }
    return text;
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
    const { userMessage, conversationHistory, userContext } = await req.json();
    const systemPrompt = buildSystemPrompt(userContext);

    // Gemini uses "user" + "model" (not "assistant"). Map OpenAI-style history.
    const mapped = (conversationHistory || []).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
    // Gemini rejects payloads that start with a "model" turn. Drop any
    // leading "model" entries (e.g. an initial assistant greeting).
    while (mapped.length > 0 && mapped[0].role !== "user") {
      mapped.shift();
    }
    // Keep only the last 20 turns to avoid bloating context.
    const trimmed = mapped.slice(-20);

    const geminiContents = [
      ...trimmed,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: geminiContents,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    };

    // Try each model in order. If all fail, retry the cheapest model once
    // after a short delay (handles transient 503 high-demand errors).
    let assistantMessage: string | null = null;
    for (const model of GEMINI_MODELS) {
      assistantMessage = await callGemini(model, body);
      if (assistantMessage) break;
    }
    if (!assistantMessage) {
      await sleep(1200);
      assistantMessage = await callGemini(GEMINI_MODELS[0], body);
    }

    if (!assistantMessage) {
      throw new Error("No response from Gemini after retries");
    }

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to get response" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

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