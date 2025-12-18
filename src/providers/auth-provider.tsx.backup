import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean; // nuevo: primera carga

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
  const [loading, setLoading] = useState(false); // loading de acciones (signin/signup)
  const [authInProgress, setAuthInProgress] = useState(false);
  const [authFlow, setAuthFlow] =
  useState<"login" | "register" | null>(null);



  // 🔥 Auto-login + recuperación de sesión
  // useEffect(() => {
  //   const loadSession = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();


  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     setInitializing(false); // YA cargó sesión inicial
  //   };

  //   loadSession();

  //   // 🔥 Escuchar cambios de sesión (login, logout, recovery)
  //   const { data: subscription } = supabase.auth.onAuthStateChange(
  //     (event, session) => {
  //      

  //       setSession(session);
  //       setUser(session?.user ?? null);
  //     }
  //   );

  //   return () => subscription.subscription.unsubscribe();
  // }, []);

    useEffect(() => {
      const loadSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();


        // ⚡ Sesión real
        setSession(session);
        setUser(session?.user ?? null);

        setInitializing(false);
      };

      loadSession();

      // 🔥 Escuchar cambios de sesión
      const { data: subscription } = supabase.auth.onAuthStateChange(
        (event, session) => {
         

          setSession(session);
          setUser(session?.user ?? null);

          if (
            event === "SIGNED_IN" ||
            event === "TOKEN_REFRESHED"
          ) {
            setAuthInProgress(false);
            setAuthFlow(null)
          }
        }
      );


      return () => subscription.subscription.unsubscribe();
    }, []);

  // SIGN UP
    const signUp = async (email: string, password: string, full_name: string) => {
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
    
    const signOut = async () => {
      setAuthFlow(null);
      setAuthInProgress(false);
      await supabase.auth.signOut();
    };


  // SIGN IN
 const signIn = async (email: string, password: string) => {
    setLoading(true);
    setAuthFlow("login");

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    return result;
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
