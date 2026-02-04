// src/viewmodels/app/useZuffyViewModel.ts
// This view model combines all the data and logic needed for the Zuffy screen
// It acts as a bridge between the UI and the business logic

import { useUserData } from "@/src/hooks/useUserData";
import { useZuffyChat } from "@/src/hooks/useZuffyChat";
import { ZuffyUserContext } from "@/src/services/zuffy-ai-service";
import { useProgressViewModel } from "@/src/viewmodels/app/useProgressViewModel";
import { useMemo } from "react";

export function useZuffyViewModel() {
  // Get user profile data
  const { profile, fullName, puffsPerDay, moneyPerMonth, currency, goal, goalSpeed } =
    useUserData();

  // Get progress data for context
  const {
    daysSinceStart,
    streak,
    moneySaved,
    currencySymbol,
    puffsLast24Hours,
    puffsLast7Days,
  } = useProgressViewModel();

  // Build the user context object that will be passed to the AI
  // This gives Zuffy all the information it needs to personalize responses
  const userContext: ZuffyUserContext = useMemo(
    () => ({
      userName: fullName.split(" ")[0], // Use first name for friendlier interaction
      puffsPerDay,
      moneyPerMonth,
      currency: currency || "CRC",
      goal,
      goalSpeed,
      worries: profile?.worries || null,
      whyStopped: profile?.why_stopped || null,
      daysSinceStart,
      // Format the streak as a readable string
      currentStreak: formatStreak(streak),
      moneySaved,
      puffsLast24Hours,
      puffsLast7Days,
    }),
    [
      fullName,
      puffsPerDay,
      moneyPerMonth,
      currency,
      goal,
      goalSpeed,
      profile?.worries,
      profile?.why_stopped,
      daysSinceStart,
      streak,
      moneySaved,
      puffsLast24Hours,
      puffsLast7Days,
    ]
  );

  // Initialize the chat hook with the user context
  const chat = useZuffyChat(userContext);

  return {
    // User info for the header greeting
    firstName: fullName.split(" ")[0],

    // All chat-related state and functions
    ...chat,
  };
}

// Helper function to format the streak object into a readable string
function formatStreak(streak: { days: number; hours: number; minutes: number }): string {
  if (streak.days > 0) {
    return `${streak.days} día${streak.days > 1 ? "s" : ""}, ${streak.hours} hora${
      streak.hours > 1 ? "s" : ""
    }`;
  }
  if (streak.hours > 0) {
    return `${streak.hours} hora${streak.hours > 1 ? "s" : ""}, ${streak.minutes} minuto${
      streak.minutes > 1 ? "s" : ""
    }`;
  }
  return `${streak.minutes} minuto${streak.minutes > 1 ? "s" : ""}`;
}
