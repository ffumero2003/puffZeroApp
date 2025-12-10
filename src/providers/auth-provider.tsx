import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { DEBUG } from "../config/debug";
import { supabase } from "../lib/supabase";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initializing: boolean; // nuevo: primera carga
  justSignedUp: boolean;
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
  justSignedUp: false,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false); // loading de acciones (signin/signup)
  const [justSignedUp, setJustSignedUp] = useState(false);

  // 🔥 Auto-login + recuperación de sesión
  // useEffect(() => {
  //   const loadSession = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();

  //     console.log("🔥 SESSION INICIAL:", session);

  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     setInitializing(false); // YA cargó sesión inicial
  //   };

  //   loadSession();

  //   // 🔥 Escuchar cambios de sesión (login, logout, recovery)
  //   const { data: subscription } = supabase.auth.onAuthStateChange(
  //     (event, session) => {
  //       console.log("🔥 AUTH EVENT:", event);
  //       console.log("🔥 NUEVA SESION:", session);

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

        console.log("🔥 SESSION INICIAL:", session);

        // ⚡ Sesión real
        setSession(session);
        setUser(session?.user ?? null);

        // -------------------------------------
        // 🔥 DEBUG FLAGS
        // -------------------------------------
        if (DEBUG.forceUserLoggedOut) {
          console.log("⚠️ DEBUG: Usuario forzado DESLOGUEADO");
          setSession(null);
          setUser(null);
        }

        if (DEBUG.forceUserLoggedIn) {
          console.log("⚠️ DEBUG: Usuario forzado LOGUEADO (dummy)");
          setUser({
            id: "debug-user",
            email: "debug@puffzero.lat",
          } as any);
        }


        setInitializing(false);
      };

      loadSession();

      // 🔥 Escuchar cambios de sesión
      const { data: subscription } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("🔥 AUTH EVENT:", event);
          console.log("🔥 NUEVA SESION:", session);

          setSession(session);
          setUser(session?.user ?? null);
        }
      );

      return () => subscription.subscription.unsubscribe();
    }, []);

  // SIGN UP
    const signUp = async (email: string, password: string, full_name: string) => {
    setLoading(true);
    const result = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    setLoading(false);

    if (!result.error) {
      setJustSignedUp(true); // 🔥 Marca que este usuario ACABA de registrarse
    }

    return result;
  };


  // SIGN IN
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return result;
  };

  // SIGN OUT
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        initializing,
        justSignedUp, 
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
