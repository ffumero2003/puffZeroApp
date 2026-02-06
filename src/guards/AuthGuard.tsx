// src/guards/AuthGuard.tsx
import { router, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { getInitialRoute, shouldBypassPaywall } from "../config/dev";
import { useAuth } from "../providers/auth-provider";

export function useAuthGuard() {
  const { user, initializing, authFlow, authInProgress, isPremium } = useAuth();
  const segments = useSegments();
  const lastDevRoute = useRef<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // PAYWALL VARIABLE
  // ═══════════════════════════════════════════════════════════════
  // - shouldBypassPaywall() reads BYPASS_PAYWALL from dev.ts
  //   → Set BYPASS_PAYWALL = true in dev.ts to skip paywall while developing
  //   → Set BYPASS_PAYWALL = false to test the real paywall flow
  // - isPremium comes from auth-provider (real subscription state)
  //   → Gets set to true after a successful purchase
  //   → Gets checked from your payment system on app load
  // - In PROD (__DEV__ = false): shouldBypassPaywall() is always false,
  //   so only isPremium matters
  // ═══════════════════════════════════════════════════════════════
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

    // 🔧 DEV MODE: If in (dev) routes, don't interfere
    if (inDev) {
      return;
    }

    // 🔓 RUTAS PÚBLICAS (siempre accesibles)
    // NOTE: verify-required removed — VerificationModal handles email
    // verification with a 7-day countdown inside the app screens
    const publicRoutes = [
      "privacy-policy",
      "terms-of-use",
      "reset-password",
      "verify-email",
    ];
    const isPublicRoute = publicRoutes.includes(segments[0]);

    // ════════════════════════════════════════════════════════
    // TIPO 1: Usuario SIN sesión (nuevo o logout)
    // → Va al onboarding. Puede ir a auth o quedarse en onboarding.
    // ════════════════════════════════════════════════════════
    if (!user) {
      const inRoot =
        !inApp && !inAuth && !inOnboarding && !inPaywall && !isPublicRoute;
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
    // → Si NO tiene premium → (paywall)/paywall (no puede salir)
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
