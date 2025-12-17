

// src/constants/routes.ts
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/(auth)/registrarse",
  FORGOT_PASSWORD: "/(auth)/forgot-password",
  RESET_PASSWORD: "/reset-password",

  //business
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_USE: "/terms-of-use",

  // Onboarding
  ONBOARDING_GOAL: "/onboarding-goal",
  ONBOARDING_SPEED: "/onboarding-speed-plan",
  ONBOARDING_PUFFS: "/onboarding-puffs",
  ONBOARDING_MONEY_SPENT: "/onboarding-money-spent",
  ONBOARDING_MONEY_SAVED: "/onboarding-money-saved",
  ONBOARDING_WORRIES: "/onboarding-worries",
  ONBOARDING_MOTIVATION: "/onboarding-motivation",
  ONBOARDING_GRAPH: "/onboarding-graph",
  ONBOARDING_COMPARISON: "/onboarding-comparison",
  ONBOARDING_ZUFFY: "/onboarding-zuffy",
  ONBOARDING_PROGRESS: "/onboarding-progress",
  ONBOARDING: "/onboarding",

  // Post signup
  POST_SIGNUP_REVIEW: "/(onboarding)/post-signup/step-review",
  POST_SIGNUP_PERCENTAGE: "/(onboarding)/post-signup/step-percentage",
  POST_SIGNUP_PLAN: "/(onboarding)/post-signup/step-personalized-plan",
  POST_SIGNUP_FACTS: "/(onboarding)/post-signup/step-facts",
  POST_SIGNUP_NOTIFICATIONS: "/(onboarding)/post-signup/step-notifications",

  // App
  HOME: "/home",
  PAYWALL: "/paywall", // futuro
} as const;
