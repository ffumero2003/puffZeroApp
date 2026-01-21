// src/guards/AuthGuard.tsx
import { router, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { getInitialRoute, shouldBypassPaywall } from "../config/dev";
import { useAuth } from "../providers/auth-provider";

export function useAuthGuard() {
  const { user, initializing, authFlow, authInProgress } = useAuth();
  const segments = useSegments();
  const lastDevRoute = useRef<string | null>(null);

  // 🔥 VARIABLE DE PAYWALL
  // - shouldBypassPaywall() = BYPASS_PAYWALL en dev.ts (independiente)
  // - En PROD: TODO conectar con tu sistema de pagos real (RevenueCat, etc.)
  const hasPremium = shouldBypassPaywall();

  useEffect(() => {
    if (initializing) return;
    if(authInProgress) return;

    // 🔧 DEV MODE: Navegar directamente a la pantalla configurada
    const devRoute = getInitialRoute();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0fd0a7db-6453-4c6c-82b9-a41e6e00598d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthGuard.tsx:devMode',message:'Dev mode check',data:{devRoute,lastDevRoute:lastDevRoute.current,willNavigate:devRoute && lastDevRoute.current !== devRoute},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
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
    const publicRoutes = ["privacy-policy", "terms-of-use", "reset-password", "verify-email", "verify-required"];
    const isPublicRoute = publicRoutes.includes(segments[0]);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0fd0a7db-6453-4c6c-82b9-a41e6e00598d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthGuard.tsx:publicRouteCheck',message:'Checking public route',data:{segments:segments,isPublicRoute,currentSegment:segments[0]},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion

    if (isPublicRoute) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0fd0a7db-6453-4c6c-82b9-a41e6e00598d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthGuard.tsx:publicRouteAllowed',message:'Public route - allowing passage',data:{route:segments[0]},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      return; // ← Dejar pasar privacy-policy, terms-of-use, reset-password, verify-email
    }


    // ════════════════════════════════════════════════════════
    // 📧 EMAIL VERIFICATION - GRACE PERIOD (3 días)
    // ════════════════════════════════════════════════════════
    const GRACE_PERIOD_DAYS = 3;

    if (user && !user.email_confirmed_at) {
      // Google users have email_confirmed_at set, so this only affects email/password users
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceCreation > GRACE_PERIOD_DAYS) {
        // Grace period expired - must verify
        if (segments[0] !== "verify-required") {
          router.replace("/verify-required");
          return;
        }
        return; // Already on verify-required, stay there
      }
      // Within grace period - let them continue using the app
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
