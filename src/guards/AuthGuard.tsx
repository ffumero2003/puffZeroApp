// src/guards/AuthGuard.tsx
import { router, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../providers/auth-provider";

export function useAuthGuard() {
  const { user, initializing } = useAuth();
  const segments = useSegments();

  // 🔥 VARIABLE DE PAYWALL (cambiá esto cuando tengas la lógica real)
  const hasPremium = false; // ← TODO: conectar con tu sistema de pagos

  useEffect(() => {
    if (initializing) return;

    const inApp = segments[0] === "(app)";
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inPaywall = segments[0] === "(paywall)";
    
    // 🔓 RUTAS PÚBLICAS (siempre accesibles)
    const publicRoutes = ["privacy-policy", "terms-of-use"];
    const isPublicRoute = publicRoutes.includes(segments[0]);

    if (isPublicRoute) {
      return; // ← Dejar pasar privacy-policy y terms-of-use
    }

    // ════════════════════════════════════════════════════════
    // TIPO 1: Usuario SIN sesión (nuevo o logout)
    // ════════════════════════════════════════════════════════
    if (!user) {
      // Si está en (app) o (paywall), mandarlo a onboarding
      if (inApp || inPaywall) {
        router.replace("/(onboarding)/onboarding");
        return;
      }
      // Si está en (auth) o (onboarding), dejarlo ahí
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 2 y 3: Usuario CON sesión
    // ════════════════════════════════════════════════════════
    if (user) {
      // Si está en (auth) o (onboarding), sacarlo de ahí
      if (inAuth || inOnboarding) {
        if (hasPremium) {
          router.replace("/(app)/home");
        } else {
          router.replace("/(paywall)/paywall");
        }
        return;
      }

      // Si NO tiene premium, bloquearlo en paywall
      if (!hasPremium && !inPaywall) {
        router.replace("/(paywall)/paywall");
        return;
      }

      // Si tiene premium pero está en paywall, mandarlo a home
      if (hasPremium && inPaywall) {
        router.replace("/(app)/home");
        return;
      }
    }
  }, [user, initializing, segments]);
}