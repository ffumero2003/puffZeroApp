// src/services/ai-quotes-service.ts
import { supabase } from "@/src/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Local cache keys — single source of truth for both home screen and notification.
// Quote refreshes every 23.5 hours so the user sees a new one each day.
const QUOTE_CACHE_KEY = "daily_quote_cached";
const QUOTE_TIMESTAMP_KEY = "daily_quote_timestamp"; // <-- renamed from QUOTE_DATE_KEY

// 23.5 hours in milliseconds (84,600,000 ms)
const QUOTE_TTL_MS = 23.5 * 60 * 60 * 1000;

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
    const now = Date.now();

    // Check local cache: is the cached quote still fresh (< 23.5 hours old)?
    const [cachedQuote, cachedTimestamp] = await Promise.all([
      AsyncStorage.getItem(QUOTE_CACHE_KEY),
      AsyncStorage.getItem(QUOTE_TIMESTAMP_KEY),
    ]);

    if (cachedQuote && cachedTimestamp) {
      const elapsed = now - parseInt(cachedTimestamp, 10);
      // Still fresh — return cached quote without network call
      if (elapsed < QUOTE_TTL_MS) {
        return cachedQuote;
      }
    }

    // Expired or no cache — call edge function for a new quote
    const { data, error } = await supabase.functions.invoke("generate-quote", {
      body: { percentage: context?.percentage ?? 0 },
    });

    if (error) throw error;

    const quote = data?.quote || fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

    // Cache locally with current timestamp
    await Promise.all([
      AsyncStorage.setItem(QUOTE_CACHE_KEY, quote),
      AsyncStorage.setItem(QUOTE_TIMESTAMP_KEY, now.toString()),
    ]);

    return quote;
  } catch (error) {
    console.log("❌ Error fetching AI quote:", error);
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }

}

/**
 * Returns the currently cached quote without making any network call.
 * Used by the notification scheduler so it shows the SAME quote
 * that the user sees on the home screen.
 */
export async function getCachedQuote(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(QUOTE_CACHE_KEY);
  } catch {
    return null;
  }
}