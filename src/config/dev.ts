// src/config/dev.ts
// 🔧 CONFIGURACIÓN DE DESARROLLO
// ============================================
// Activá esto cuando estés desarrollando

export const DEV_CONFIG = {
  // 🎚️ CONTROL PRINCIPAL
  ENABLED: false, // ← CAMBIAR A false PARA PRODUCCIÓN
  
  // 🚀 NAVEGACIÓN DIRECTA (comentá o poné null para flujo normal)
  DIRECT_SCREEN: "/(app)/profile", // ← Cambiá esto según donde estés trabajando
  
  // 👤 USUARIO MOCK (cuando ENABLED = true)
  MOCK_USER: {
    id: "dev-user-12345",
    email: "dev@puffzero.app",
    
    user_metadata: {
      full_name: "Usuario Dev",
      avatar_url: null,
    },

    // Profile completo
    profile: {
      full_name: "Usuario Dev",
      puffs_per_day: 150,
      money_per_month: 25000,
      currency: "CRC",
      goal: "quit",
      goal_speed: "30",
      why_stopped: ["salud", "finanzas"],
      worries: ["ansiedad", "abstinencia"],
      created_at: "2024-12-01T00:00:00Z",
    },
  },

  // 🔐 BYPASS DE VERIFICACIONES
  SKIP_EMAIL_VERIFICATION: true,
  SKIP_ONBOARDING_CHECKS: true,

  // 💳 SIMULAR SUSCRIPCIÓN
  MOCK_PREMIUM: true, // true = premium | false = free
};

// ═══════════════════════════════════════════════════════════
// HELPERS (NO TOCAR)
// ═══════════════════════════════════════════════════════════

export const isDevMode = () => {
  return __DEV__ && DEV_CONFIG.ENABLED;
};

export const getDevUser = () => {
  return isDevMode() ? DEV_CONFIG.MOCK_USER : null;
};

export const shouldSkipOnboarding = () => {
  return isDevMode() && DEV_CONFIG.SKIP_ONBOARDING_CHECKS;
};

export const hasMockPremium = () => {
  return isDevMode() && DEV_CONFIG.MOCK_PREMIUM;
};

export const getInitialRoute = () => {
  if (!isDevMode()) return null;
  return DEV_CONFIG.DIRECT_SCREEN;
};
