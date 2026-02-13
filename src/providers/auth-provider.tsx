// src/providers/auth-provider.tsx
import { sendWelcomeBackNotification } from "@/src/services/notifications/welcome-back-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import Purchases from "react-native-purchases";
import {
  checkPremiumEntitlement,
  initRevenueCat,
  resetRevenueCat,
} from "../lib/revenue-cat";
import { supabase } from "../lib/supabase";
import { checkAndSendDailyAchievementOnOpen } from "../services/notifications/daily-achievement-notification";
import { scheduleDailyQuoteNotification } from "../services/notifications/daily-quote-notification";
import { refreshDailyReminderIfNeeded } from "../services/notifications/daily-reminder-notification";
import {
  checkAndSendFirstPuffFreeDayNotification,
  scheduleEndOfDayPuffFreeCheck,
} from "../services/notifications/first-puff-free-day-notification";
import { updateLastActivity } from "../services/notifications/inactivity-notification";
import { areNotificationsEnabled } from "../services/notifications/notification-service";
import { scheduleWeeklySummaryNotification } from "../services/notifications/weekly-summary-notification";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean;

  authFlow: "login" | "register" | null;
  setAuthFlow: (flow: "login" | "register" | null) => void;

  authInProgress: boolean;
  setAuthInProgress: (v: boolean) => void;

  postSignupCompleted: boolean;
  setPostSignupCompleted: (v: boolean) => void;

  // ═══════════════════════════════════════════════
  // NEW: Premium/subscription state
  // This is what the AuthGuard checks to decide
  // if user goes to (app) or gets stuck in (paywall)
  // ═══════════════════════════════════════════════
  isPremium: boolean;
  setIsPremium: (v: boolean) => void;

  signUp: (
    email: string,
    password: string,
    full_name: string
  ) => Promise<{ data: any; error: any }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;

  // Add to AuthContextProps interface:
  isRevenueCatReady: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  initializing: true,

  postSignupCompleted: false,
  setPostSignupCompleted: () => {},

  authFlow: null,
  setAuthFlow: () => {},

  authInProgress: false,
  setAuthInProgress: () => {},

  // NEW: default to false (no premium)
  isPremium: false,
  setIsPremium: () => {},

  isRevenueCatReady: false,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [postSignupCompleted, setPostSignupCompletedState] = useState(true);
  // Add this state next to the existing isPremium state (around line 95):
  const [isRevenueCatReady, setIsRevenueCatReady] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [authFlow, setAuthFlow] = useState<"login" | "register" | null>(null);

  // NEW: premium state — starts false, gets set to true after purchase
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const loadPostSignupFlag = async () => {
      const flag = await AsyncStorage.getItem("postSignupCompleted");
      // If the flag has never been set (null), default to true
      // (existing users who already completed onboarding won't have this key)
      setPostSignupCompletedState(flag === null ? true : flag === "true");
    };
    loadPostSignupFlag();
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setInitializing(false);
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔐 Auth event:", event);

        // Don't update user/session state for PASSWORD_RECOVERY events
        // The reset-password screen handles this flow independently
        if (event === "PASSWORD_RECOVERY") {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // setAuthInProgress(false);
          // setAuthFlow(null);
        }
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const setPostSignupCompleted = async (v: boolean) => {
    setPostSignupCompletedState(v);
    await AsyncStorage.setItem("postSignupCompleted", v.toString());
  };

  // ═══════════════════════════════════════════════════════════════
  // RevenueCat: Init SDK + check premium when user session loads
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!user?.id) {
      setIsPremium(false);
      return;
    }

    const setupRevenueCat = async () => {
      await initRevenueCat(user.id);
      setIsRevenueCatReady(true); // ← Signal that SDK is ready

      const isActive = await checkPremiumEntitlement();
      setIsPremium(isActive);

      // Listen for real-time subscription changes
      // (e.g., user subscribes from another device, subscription renews/expires)
      Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        const stillActive =
          customerInfo.entitlements.active["PuffZero Pro"] !== undefined;
        setIsPremium(stillActive);
      });
    };

    setupRevenueCat();
  }, [user?.id]);

  const signUp = async (email: string, password: string, full_name: string) => {
    setLoading(true);
    setAuthFlow("register");

    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    // NEW: When a user registers, mark post-signup as not completed
    // This persists so even if app restarts, they'll go back to post-signup
    if (!result.error) {
      await setPostSignupCompleted(false);
    }

    setLoading(false);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setAuthFlow("login");

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    // 🔔 Send welcome back notification on successful login
    if (!result.error && result.data?.user) {
      const notificationsEnabled = await areNotificationsEnabled();
      if (notificationsEnabled) {
        // Default to user_metadata name
        let firstName =
          result.data.user.user_metadata?.full_name?.split(" ")[0];

        // Always prefer the name stored in the profile (set during registration)
        // over user_metadata, which may contain the email instead of the real name.
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", result.data.user.id)
          .maybeSingle();

        // Debug log — check what the profile query actually returns
        console.log("🔔 Notification name debug:", {
          metadataName: result.data.user.user_metadata?.full_name,
          profileName: profileData?.full_name,
          profileError: profileError?.message,
          userId: result.data.user.id,
        });

        if (profileData?.full_name) {
          firstName = profileData.full_name.trim().split(" ")[0];
        }

        await sendWelcomeBackNotification(firstName);
      }
    }

    return result;
  };

  const signOut = async () => {
    setAuthFlow(null);
    setAuthInProgress(false);
    setIsPremium(false);
    // Reset RevenueCat so next login gets fresh identity
    await resetRevenueCat();
    await setPostSignupCompleted(true);
    await supabase.auth.signOut();
  };

  // When user is authenticated and app becomes active:
  // Reset inactivity timers on EVERY app foreground, not just when user?.id changes
  useEffect(() => {
    if (!user?.id) return;

    // Run immediately on mount (first login / auth resolved)
    updateLastActivity();
    scheduleWeeklySummaryNotification();
    checkAndSendFirstPuffFreeDayNotification(user.id);
    scheduleEndOfDayPuffFreeCheck();
    scheduleDailyQuoteNotification();
    refreshDailyReminderIfNeeded();
    checkAndSendDailyAchievementOnOpen(user.id);

    // Listen for app coming back to foreground → user is active, reset inactivity timers
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // User opened/resumed the app → they are active, reset inactivity timers
        updateLastActivity();
      }
    });

    // Cleanup listener when user logs out or component unmounts
    return () => {
      subscription.remove();
    };
  }, [user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        initializing,

        authFlow,
        setAuthFlow,

        authInProgress,
        setAuthInProgress,

        // NEW: expose premium state
        isPremium,
        setIsPremium,

        signUp,
        signIn,
        signOut,

        postSignupCompleted,
        setPostSignupCompleted,

        isRevenueCatReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
