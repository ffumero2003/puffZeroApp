// src/services/zuffy-ai-service.ts
// This service now calls our secure Supabase Edge Function
// instead of calling OpenAI directly from the app

import { supabase } from "@/src/lib/supabase";

// Define the type for user context that we'll pass to the AI
export type ZuffyUserContext = {
  userName: string;
  puffsPerDay: number | null;
  moneyPerMonth: number | null;
  currency: string;
  goal: string | null;
  goalSpeed: string | null;
  worries: string[] | null;
  whyStopped: string[] | null;
  daysSinceStart: number;
  currentStreak: string;
  moneySaved: number;
  puffsLast24Hours: number;
  puffsLast7Days: number;
};

// Define the structure of a chat message
export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Main function to send a message to Zuffy via our secure edge function
export async function sendMessageToZuffy(
  userMessage: string,
  conversationHistory: ChatMessage[],
  userContext: ZuffyUserContext
): Promise<string> {
  try {
    // Call our Supabase Edge Function instead of OpenAI directly
    // This keeps the API key secure on the server
    const { data, error } = await supabase.functions.invoke("zuffy-chat", {
      body: {
        userMessage,
        conversationHistory,
        userContext,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      throw error;
    }

    if (!data?.message) {
      throw new Error("No response from AI");
    }

    return data.message;
  } catch (error) {
    console.error("Error calling Zuffy API:", error);
    return "Lo siento, estoy teniendo problemas para responder en este momento. ¿Podrías intentarlo de nuevo? 💙";
  }
}

// Quick action prompts
export const QUICK_ACTION_PROMPTS = {
  howToFeel: "¿Cómo debería sentirme hoy en mi proceso de dejar de vapear?",
  thinkingOfSmoking:
    "Estoy pensando en fumar/vapear ahora mismo. Necesito ayuda para resistir.",
  myProgress:
    "¿Qué he logrado hasta ahora en mi proceso? Dame un resumen de mi progreso.",
} as const;
