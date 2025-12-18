// src/providers/auth-provider.tsx
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { getDevUser, isDevMode } from "../config/dev";
import { supabase } from "../lib/supabase";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean;

  authFlow: "login" | "register" | null;
  setAuthFlow: (flow: "login" | "register") => void;

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

  isDevUser: boolean;
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

  isDevUser: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [authFlow, setAuthFlow] = useState<"login" | "register" | null>(null);
  const [isDevUser, setIsDevUser] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      // 🔧 DEV MODE: Cargar usuario mock
      if (isDevMode()) {
        console.log("🔧 DEV MODE - Usuario mock cargado");
        const mockUser = getDevUser();

        if (mockUser) {
          const devUser = {
            id: mockUser.id,
            email: mockUser.email,
            user_metadata: mockUser.user_metadata,
            app_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User;

          setUser(devUser);
          setIsDevUser(true);
          setInitializing(false);
          return;
        }
      }

      // ⚡ Flujo normal
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setIsDevUser(false);
      setInitializing(false);
    };

    loadSession();

    if (!isDevMode()) {
      const { data: subscription } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("🔐 Auth event:", event);

          setSession(session);
          setUser(session?.user ?? null);
          setIsDevUser(false);

          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            setAuthInProgress(false);
            setAuthFlow(null);
          }
        }
      );

      return () => subscription.subscription.unsubscribe();
    }
  }, []);

  const signUp = async (
    email: string,
    password: string,
    full_name: string
  ) => {
    if (isDevMode()) {
      console.log("🔧 DEV MODE - Registro simulado");
      const mockUser = getDevUser();

      setUser({
        id: mockUser!.id,
        email: mockUser!.email,
        user_metadata: mockUser!.user_metadata,
      } as User);

      setIsDevUser(true);

      return {
        data: { user: mockUser },
        error: null,
      };
    }

    setLoading(true);
    setAuthFlow("register");

    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });

    setLoading(false);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    if (isDevMode()) {
      console.log("🔧 DEV MODE - Login simulado");
      const mockUser = getDevUser();

      setUser({
        id: mockUser!.id,
        email: mockUser!.email,
        user_metadata: mockUser!.user_metadata,
      } as User);

      setIsDevUser(true);

      return {
        data: { user: mockUser },
        error: null,
      };
    }

    setLoading(true);
    setAuthFlow("login");

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setAuthFlow(null);
    setAuthInProgress(false);
    setIsDevUser(false);

    if (!isDevMode()) {
      await supabase.auth.signOut();
    } else {
      console.log("🔧 DEV MODE - Logout simulado");
      setUser(null);
    }
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

        isDevUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
