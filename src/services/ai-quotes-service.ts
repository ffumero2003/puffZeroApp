// src/services/ai-quotes-service.ts
import { supabase } from "@/src/lib/supabase";

type QuoteContext = {
  percentage?: number;
};

export async function fetchAIQuote(context?: QuoteContext): Promise<string> {
  const fallbackQuotes = [
    "Cada 'no' al vape es un 'sí' a tu mejor versión.",
    "Tu salud te lo agradece cada día que resistes.",
    "Cada paso cuenta, estás más cerca de tu meta.",
    "Tu fuerza de voluntad es más poderosa de lo que crees.",
    "Hoy es un buen día para seguir avanzando.",
  ];

  try {
    const { data, error } = await supabase.functions.invoke("generate-quote", {
      body: { percentage: context?.percentage ?? 0 },
    });

    if (error) throw error;

    return data?.quote || fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  } catch (error) {
    console.log("❌ Error fetching AI quote:", error);
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}