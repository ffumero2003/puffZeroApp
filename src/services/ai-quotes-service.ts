// src/services/ai-quotes-service.ts
import { OPENAI_API_KEY } from "@/src/config/env";

type QuoteContext = {
  firstName?: string;
  dailyGoal?: number;
  todayPuffs?: number;
  percentage?: number;
};

export async function fetchAIQuote(context?: QuoteContext): Promise<string> {
  const fallbackQuotes = [
    "Cada 'no' al vape es un 'sí' a tu mejor versión.",
    "Tu salud te lo agradece cada día que resistes.",
    "Cada paso cuenta, estás más cerca de tu meta.",
    "Tu fuerza de voluntad es más poderosa de lo que crees.",
    "Hoy es un buen día para seguir avanzando.",
    "Respirá profundo, estás logrando algo increíble.",
    "Tu futuro yo te está agradeciendo ahora mismo.",
  ];

  try {
    const systemPrompt = `Eres un coach motivacional especializado en ayudar a personas a dejar de vapear. 
Genera UNA frase motivacional corta (máximo 15 palabras) en español latinoamericano.
La frase debe ser:
- Positiva y alentadora
- Personal y empática
- Enfocada en el progreso, no en la culpa
- Sin usar comillas en la respuesta
Solo responde con la frase, nada más.`;

    let userPrompt = "Genera una frase motivacional para alguien dejando el vape.";
    
    if (context) {
      if (context.percentage !== undefined) {
        if (context.percentage === 0) {
          userPrompt = "Genera una frase motivacional para alguien que aún no ha vapeado hoy. Celebra su logro.";
        } else if (context.percentage < 50) {
          userPrompt = "Genera una frase motivacional para alguien que va bien con su límite diario de vape.";
        } else if (context.percentage < 100) {
          userPrompt = "Genera una frase motivacional para alguien que se acerca a su límite diario de vape. Anímalo a resistir.";
        } else {
          userPrompt = "Genera una frase motivacional compasiva para alguien que superó su límite de vape hoy. Sin culpa, solo apoyo.";
        }
      }
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 60,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      console.log("❌ OpenAI API error:", response.status);
      throw new Error("API request failed");
    }

    const data = await response.json();
    const quote = data.choices?.[0]?.message?.content?.trim();

    if (!quote) {
      throw new Error("No quote returned");
    }

    return quote;
  } catch (error) {
    console.log("❌ Error fetching AI quote, using fallback:", error);
    // Return random fallback quote on error
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }
}