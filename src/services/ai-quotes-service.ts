// src/services/ai-quotes-service.ts
import { supabase } from "@/src/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Local cache so we don't hit the edge function on every app open.
// The edge function already stores one quote per day in daily_quotes table
// (same quote for all users), but we cache it locally to avoid
// unnecessary network calls and random fallback flickers.
const QUOTE_CACHE_KEY = "daily_quote_cached";
const QUOTE_DATE_KEY = "daily_quote_date";

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
    const today = new Date().toISOString().split("T")[0];

    // Check if we already fetched today's quote
    const [cachedQuote, cachedDate] = await Promise.all([
      AsyncStorage.getItem(QUOTE_CACHE_KEY),
      AsyncStorage.getItem(QUOTE_DATE_KEY),
    ]);

    // Same day = return cached quote, no network call
    if (cachedQuote && cachedDate === today) {
      return cachedQuote;
    }

    // New day — call edge function (it returns the global daily quote)
    const { data, error } = await supabase.functions.invoke("generate-quote", {
      body: { percentage: context?.percentage ?? 0 },
    });

    if (error) throw error;

    const quote = data?.quote || fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    // Cache locally so we don't call again today
    await Promise.all([
      AsyncStorage.setItem(QUOTE_CACHE_KEY, quote),
      AsyncStorage.setItem(QUOTE_DATE_KEY, today),
    ]);

    return quote;
  } catch (error) {
    console.log("❌ Error fetching AI quote:", error);
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

}
