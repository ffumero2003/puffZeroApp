// src/services/verification/verification-service.ts
// Unified service for both account verification and email change verification

import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_VERIFICATION_KEY = "pending_verification";

// Two types of verification
export type VerificationType = "account" | "email_change";

export interface PendingVerification {
  type: VerificationType;
  email: string;           // Email to verify (new email for email_change, account email for account)
  oldEmail?: string;       // Only for email_change type
  requestedAt: string;     // ISO date string
}

// ============================================
// Store/Get/Clear pending verification
// ============================================

/**
 * Store a pending verification request
 */
export async function storePendingVerification(
  type: VerificationType,
  email: string,
  oldEmail?: string
): Promise<void> {
  const pending: PendingVerification = {
    type,
    email,
    oldEmail,
    requestedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(pending));
  // console.log(`📧 Pending ${type} verification stored:`, email);
}

/**
 * Get pending verification if exists
 */
export async function getPendingVerification(): Promise<PendingVerification | null> {
  const data = await AsyncStorage.getItem(PENDING_VERIFICATION_KEY);
  if (!data) return null;
  return JSON.parse(data) as PendingVerification;
}

/**
 * Clear pending verification (after verification or expiration)
 */
export async function clearPendingVerification(): Promise<void> {
  await AsyncStorage.removeItem(PENDING_VERIFICATION_KEY);
  console.log("📧 Pending verification cleared");
}

// ============================================
// Time calculations
// ============================================

const EXPIRY_DAYS = 7;
const MANDATORY_DAYS = 7; // When modal becomes mandatory (can't dismiss)

/**
 * Check if pending verification has expired
 */
export function isVerificationExpired(pending: PendingVerification): boolean {
  const daysSince = getDaysSinceVerificationRequest(pending);
  return daysSince >= EXPIRY_DAYS;
}

/**
 * Check if modal should be mandatory (can't close)
 */
export function isVerificationMandatory(pending: PendingVerification): boolean {
  const daysSince = getDaysSinceVerificationRequest(pending);
  return daysSince >= MANDATORY_DAYS;
}

/**
 * Get days since verification request
 */
export function getDaysSinceVerificationRequest(pending: PendingVerification): number {
  const requestedAt = new Date(pending.requestedAt);
  const now = new Date();
  return Math.floor((now.getTime() - requestedAt.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get days remaining until expiry
 */
export function getDaysRemainingForVerification(pending: PendingVerification): number {
  const daysSince = getDaysSinceVerificationRequest(pending);
  return Math.max(0, EXPIRY_DAYS - daysSince);
}

// ============================================
// Helper for backwards compatibility
// ============================================

// Alias for email change (keeps existing code working)
export async function storePendingEmailChange(oldEmail: string, newEmail: string): Promise<void> {
  return storePendingVerification("email_change", newEmail, oldEmail);
}

// Alias for account verification
export async function storePendingAccountVerification(email: string): Promise<void> {
  return storePendingVerification("account", email);
}
