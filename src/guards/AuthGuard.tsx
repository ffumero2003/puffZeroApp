// src/guards/AuthGuard.tsx
import { router, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { getInitialRoute, shouldBypassPaywall } from "../config/dev";
import { useAuth } from "../providers/auth-provider";

export function useAuthGuard() {
  const {
    user,
    initializing,
    authFlow,
    authInProgress,
    isPremium,
    postSignupCompleted,
    setIsPremium,
    setPostSignupCompleted,
  } = useAuth();
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

    const inRoot = !inApp && !inAuth && !inOnboarding && !inPaywall;

    // 🔓 RUTAS PÚBLICAS
    const publicRoutes = [
      "privacy-policy",
      "terms-of-use",
      "reset-password",
      "verify-email",
    ];
    const isPublicRoute = publicRoutes.includes(segments[0]);
    if (isPublicRoute) return;

    // ════════════════════════════════════════════════════════
    // TIPO 1: Usuario SIN sesión
    // ════════════════════════════════════════════════════════
    if (!user) {
      if (inApp || inPaywall || inRoot) {
        router.replace("/(onboarding)/onboarding");
        return;
      }
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 2: Usuario CON sesión que NO ha completado post-signup
    // This now works on app restart because postSignupCompleted is persisted
    // ════════════════════════════════════════════════════════
    if (user && !postSignupCompleted) {
      // If bypass is active, skip the entire post-signup flow
      if (shouldBypassPaywall()) {
        setIsPremium(true);
        setPostSignupCompleted(true);
        router.replace("/(app)/home");
        return;
      }
      if (!inPostSignup) {
        router.replace("/(onboarding)/post-signup/step-review");
        return;
      }
      return;
    }

    // ════════════════════════════════════════════════════════
    // TIPO 3: Usuario CON sesión activa y post-signup completado
    // ════════════════════════════════════════════════════════
    if (user) {
      if ((inAuth || inOnboarding || inRoot) && !inPostSignup) {
        if (hasPremium) {
          router.replace("/(app)/home");
        } else {
          router.replace("/(paywall)/paywall");
        }
        return;
      }

      if (!hasPremium && !inPaywall && !inPostSignup) {
        router.replace("/(paywall)/paywall");
        return;
      }

      if (hasPremium && inPaywall) {
        router.replace("/(app)/home");
        return;
      }
    }
  }, [user, initializing, segments, authFlow, isPremium, postSignupCompleted]);
}
