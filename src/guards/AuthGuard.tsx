// src/guards/AuthGuard.tsx
import { router, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { getInitialRoute, shouldBypassPaywall } from "../config/dev";
import { useAuth } from "../providers/auth-provider";

export function useAuthGuard() {
  const { user, initializing, authFlow } = useAuth();
  const segments = useSegments();
  const lastDevRoute = useRef<string | null>(null);

  // 🔥 VARIABLE DE PAYWALL
  // - shouldBypassPaywall() = BYPASS_PAYWALL en dev.ts (independiente)
  // - En PROD: TODO conectar con tu sistema de pagos real (RevenueCat, etc.)
  const hasPremium = shouldBypassPaywall();

  useEffect(() => {
    if (initializing) return;

    // 🔧 DEV MODE: Navegar directamente a la pantalla configurada
    const devRoute = getInitialRoute();
    if (devRoute) {
      // Only navigate if we haven't navigated to THIS specific route yet
      if (lastDevRoute.current !== devRoute) {
        lastDevRoute.current = devRoute;  // ← Remember which route we navigated to
        console.log("🔧 DEV MODE - Navegando a:", devRoute);
        router.replace(devRoute as any);
      }
      return;
    }

    const inApp = segments[0] === "(app)";
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inPaywall = segments[0] === "(paywall)";
    const inPostSignup = segments[1] === "post-signup"; // 🔥 DETECTAR POST-SIGNUP
    
    // 🔓 RUTAS PÚBLICAS (siempre accesibles)
    const publicRoutes = ["privacy-policy", "terms-of-use", "reset-password"];
    const isPublicRoute = publicRoutes.includes(segments[0]);

    if (isPublicRoute) {
      return; // ← Dejar pasar privacy-policy, terms-of-use, reset-password
    }

    // ════════════════════════════════════════════════════════
    // TIPO 1: Usuario SIN sesión (nuevo o logout)
    // ════════════════════════════════════════════════════════
    if (!user) {
      // Si está en (app), (paywall) o en root (/), mandarlo a onboarding
      const inRoot = !inApp && !inAuth && !inOnboarding && !inPaywall && !isPublicRoute;
      if (inApp || inPaywall || inRoot) {
        router.replace("/(onboarding)/onboarding");
        return;
      }
      // Si está en (auth) o (onboarding), dejarlo ahí
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 2: Usuario CON sesión que acaba de REGISTRARSE
    // ════════════════════════════════════════════════════════
    if (user && authFlow === "register") {
      // 🔥 Si viene del registro, DEBE estar en post-signup O paywall O app
      if (!inPostSignup && !inOnboarding && !inPaywall && !inApp) {
        router.replace("/(onboarding)/post-signup/step-review");
        return;
      }
      // Si está en post-signup, paywall o app, dejarlo navegar libremente
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 3: Usuario CON sesión (login o ya completó onboarding)
    // ════════════════════════════════════════════════════════
    if (user) {
      // Si está en (auth) o en onboarding (pero NO post-signup), sacarlo
      if ((inAuth || inOnboarding) && !inPostSignup) {
        if (hasPremium) {
          router.replace("/(app)/home");
        } else {
          router.replace("/(paywall)/paywall");
        }
        return;
      }

      // Si NO tiene premium, bloquearlo en paywall (excepto si está en post-signup)
      if (!hasPremium && !inPaywall && !inPostSignup) {
        router.replace("/(paywall)/paywall");
        return;
      }

      // Si tiene premium pero está en paywall, mandarlo a home
      if (hasPremium && inPaywall) {
        router.replace("/(app)/home");
        return;
      }
    }
  }, [user, initializing, segments, authFlow]);
}
