// src/providers/auth-provider.tsx
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  areNotificationsEnabled,
  savePushTokenToProfile,
  sendWelcomeBackNotification
} from "../services/notification-service";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean;

  authFlow: "login" | "register" | null;
  setAuthFlow: (flow: "login" | "register" | null) => void;

  authInProgress: boolean;
  setAuthInProgress: (v: boolean) => void;

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
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  initializing: true,

  authFlow: null,
  setAuthFlow: () => {},

  authInProgress: false,
  setAuthInProgress: () => {},

  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [authFlow, setAuthFlow] = useState<"login" | "register" | null>(null);

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

  const signUp = async (
    email: string,
    password: string,
    full_name: string
  ) => {
    setLoading(true);
    setAuthFlow("register");

    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    setLoading(false);
    
    // Note: Welcome notification is sent in useRegisterViewModel after profile creation
    // This ensures we have confirmed the registration was successful
    
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
        const firstName = result.data.user.user_metadata?.full_name?.split(" ")[0];
        sendWelcomeBackNotification(firstName);
      }
      // 📲 Save push token to profile for daily notifications
      savePushTokenToProfile(result.data.user.id);
    }

    return result;
  };

  const signOut = async () => {
    setAuthFlow(null);
    setAuthInProgress(false);
    await supabase.auth.signOut();
  };

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

        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
