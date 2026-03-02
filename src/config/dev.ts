// src/config/dev.ts
// 🔧 CONFIGURACIÓN DE DESARROLLO
// ============================================

// ════════════════════════════════════════════════════════════════
// 🚪 BYPASS PAYWALL - VARIABLE INDEPENDIENTE
// ════════════════════════════════════════════════════════════════
// true = salta el paywall, va directo a la app (para testear el flow)
// false = comportamiento normal (paywall bloquea)
export const BYPASS_PAYWALL = false;

// ════════════════════════════════════════════════════════════════
// 🎚️ DEV CONFIG - Para navegar directo a una pantalla
// ════════════════════════════════════════════════════════════════
export const DEV_CONFIG = {
  // ENABLED te deja ir directo a una pantalla específica
  ENABLED: false, // ← CAMBIAR A false PARA PRODUCCIÓN

  // 🚀 NAVEGACIÓN DIRECTA (pantalla a la que vas directo cuando ENABLED = true)
  DIRECT_SCREEN: "/(onboarding)/post-signup/step-paywall", // ← Cambiá esto según donde estés trabajando
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

export const isDevMode = () => {
  return __DEV__ && DEV_CONFIG.ENABLED;
  // return true
  //return true is for beta testers.
};

// 🚪 BYPASS PAYWALL - Independiente de ENABLED
// Solo requiere estar en desarrollo (__DEV__) y BYPASS_PAYWALL = true
export const shouldBypassPaywall = () => {
  return __DEV__ && BYPASS_PAYWALL;
  // return true
};

export const getInitialRoute = () => {
  if (!isDevMode()) return null;
  return DEV_CONFIG.DIRECT_SCREEN;
};
