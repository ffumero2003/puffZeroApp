// src/lib/revenue-cat.ts
// Centralized RevenueCat initialization + helpers
// Called once when user authenticates (from auth-provider)

import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

// Your RevenueCat API key (from the dashboard)
// This is a PUBLIC key — safe to include in client code
const API_KEY = Platform.select({
  ios: "appl_KZEHQlsbsknNgXLadldfkxeKxPR",
  // android: "goog_XXXXXXXX", // add later if needed
}) as string;

// Track whether we've already configured the SDK this session
let isConfigured = false;

/**
 * Initialize RevenueCat SDK.
 * - Pass the Supabase user ID so purchases are linked to this user.
 * - Safe to call multiple times — will only configure once.
 */
export async function initRevenueCat(userId?: string) {
  if (isConfigured) return;

  // Verbose logs in dev so you can see every SDK call in Metro
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  }

  Purchases.configure({
    apiKey: API_KEY,
    appUserID: userId ?? undefined, // links purchases to your Supabase user
  });

  isConfigured = true;
}

// /**
//  * Check if user has the "PuffZero Pro" entitlement active.
//  * Returns true if they have a valid subscription.
//  */
export async function checkPremiumEntitlement(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    // "PuffZero Pro" must match EXACTLY what you named
    // the entitlement in RevenueCat dashboard
    return customerInfo.entitlements.active["PuffZero Pro"] !== undefined;
  } catch (e) {
    console.error("RevenueCat: error checking entitlement", e);
    return false;
  }
}

/**
 * Reset SDK state on logout.
 * This ensures the next user who logs in gets a fresh RevenueCat identity.
 */
export async function resetRevenueCat() {
  try {
    isConfigured = false;
    await Purchases.logOut();
  } catch (e) {
    // logOut throws if no user was logged in — safe to ignore
    console.log("RevenueCat: logOut (no-op if anonymous)", e);
  }
}
