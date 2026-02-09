// src/guards/AuthGuard.tsx
import { router, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { getInitialRoute, shouldBypassPaywall } from "../config/dev";
import { useAuth } from "../providers/auth-provider";

export function useAuthGuard() {
  const { user, initializing, authFlow, authInProgress, isPremium } = useAuth();
  const segments = useSegments();
  const lastDevRoute = useRef<string | null>(null);

  const hasPremium = shouldBypassPaywall() || isPremium;

  useEffect(() => {
    if (initializing) return;
    if (authInProgress) return;

    // 🔧 DEV MODE: Navegar directamente a la pantalla configurada
    const devRoute = getInitialRoute();

    if (devRoute) {
      if (lastDevRoute.current !== devRoute) {
        lastDevRoute.current = devRoute;
        console.log("🔧 DEV MODE - Navegando a:", devRoute);
        router.replace(devRoute as any);
      }
      return;
    }

    const inApp = segments[0] === "(app)";
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inPaywall = segments[0] === "(paywall)";
    const inPostSignup = segments[1] === "post-signup";
    const inDev = segments[0] === "(dev)";

    // NEW: Detect if user is at the root index (no group segment)
    // This happens on fresh app open / reload before any redirect
    const inRoot = !inApp && !inAuth && !inOnboarding && !inPaywall && !inDev;

    // 🔧 DEV MODE: If in (dev) routes, don't interfere
    if (inDev) {
      return;
    }

    // 🔓 RUTAS PÚBLICAS (siempre accesibles)
    const publicRoutes = [
      "privacy-policy",
      "terms-of-use",
      "reset-password",
      "verify-email",
    ];
    const isPublicRoute = publicRoutes.includes(segments[0]);

    if (isPublicRoute) {
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 1: Usuario SIN sesión (nuevo o logout)
    // → Va al onboarding. Puede ir a auth o quedarse en onboarding.
    // ════════════════════════════════════════════════════════
    if (!user) {
      if (inApp || inPaywall || inRoot) {
        router.replace("/(onboarding)/onboarding");
        return;
      }
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 2: Usuario CON sesión que acaba de REGISTRARSE
    // → Debe completar el post-signup flow antes de todo
    // ════════════════════════════════════════════════════════
    if (user && authFlow === "register") {
      if (!inPostSignup && !inOnboarding && !inPaywall && !inApp) {
        router.replace("/(onboarding)/post-signup/step-review");
        return;
      }
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 3: Usuario CON sesión activa (login o returning)
    // → Si tiene premium → (app)/home
    // → Si NO tiene premium → (paywall)/paywall
    // ════════════════════════════════════════════════════════
    if (user) {
      // NEW: If user is at root index or in auth/onboarding, send them
      // to the right place. This is the key fix — on app reload,
      // the user lands at root index and needs to be redirected.
      if ((inAuth || inOnboarding || inRoot) && !inPostSignup) {
        if (hasPremium) {
          router.replace("/(app)/home");
        } else {
          router.replace("/(paywall)/paywall");
        }
        return;
      }

      // Si NO tiene premium, bloquearlo en paywall (excepto post-signup)
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
  }, [user, initializing, segments, authFlow, isPremium]);
}
