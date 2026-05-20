// app/(paywall)/paywall.tsx
import Check from "@/assets/images/paywall/check.png";
import Fire from "@/assets/images/paywall/fire.png";
import Statistics from "@/assets/images/paywall/statistics.png";
import Target from "@/assets/images/paywall/target.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import FeatureItem from "@/src/components/paywall/FeatureItem";
import SubscriptionOption from "@/src/components/paywall/SubscriptionOption";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useOnboardingPaywallViewModel } from "@/src/viewmodels/onboarding/useOnboardingPaywallViewModel";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// RevenueCat imports
import Purchases, { PurchasesPackage } from "react-native-purchases";

export default function Paywall() {
  const {
    name,
    goal_speed,
    puffs_per_day,
    money_per_month,
    currency,
    why_stopped,
    completeOnboarding,
    resetAll,
  } = useOnboarding();
  const { user, setAuthFlow, setIsPremium, isRevenueCatReady } = useAuth();

  // Fallback prices (shown only if RevenueCat fails to load)
  const fallbackMonthly = "$5.99";
  const fallbackYearly = "$36.99";

  const { formatMoney } = useOnboardingPaywallViewModel();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const colors = useThemeColors();

  // RevenueCat state
  const [loading, setLoading] = useState(false);
  const [monthlyPkg, setMonthlyPkg] = useState<PurchasesPackage | null>(null);
  const [yearlyPkg, setYearlyPkg] = useState<PurchasesPackage | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState(fallbackMonthly);
  const [yearlyPrice, setYearlyPrice] = useState(fallbackYearly);
  // Whether offerings finished loading (success or fail)
  const [offersLoaded, setOffersLoaded] = useState(false);

  // Load real prices from RevenueCat on mount
  useEffect(() => {
    if (!isRevenueCatReady) return;

    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        if (!current) return;

        if (current.monthly) {
          setMonthlyPkg(current.monthly);
          setMonthlyPrice(current.monthly.product.priceString);
        }
        if (current.annual) {
          setYearlyPkg(current.annual);
          setYearlyPrice(current.annual.product.priceString);
        }
      } catch (e) {
        console.error("Error loading offerings:", e);
      } finally {
        // ← NEW: mark as loaded even if it failed
        setOffersLoaded(true);
      }
    };
    loadOfferings();
  }, [isRevenueCatReady]);

  const displayName =
    name || (user?.user_metadata?.full_name as string | undefined) || undefined;
  const firstName = displayName?.trim().split(" ")[0];

  const puffsText = puffs_per_day ? (
    <>
      Registrá tu progreso diario partiendo de{" "}
      <AppText weight="bold" style={{ color: colors.primary }}>
        {puffs_per_day} puffs
      </AppText>
    </>
  ) : (
    "Registrá tu progreso diario y visualizá cada avance"
  );

  const planText = goal_speed ? (
    <>
      No es fuerza de voluntad: es un plan claro de{" "}
      <AppText weight="bold" style={{ color: colors.primary }}>
        {goal_speed} días
      </AppText>
    </>
  ) : (
    "Tu plan está diseñado para que avances paso a paso con claridad"
  );

  const moneyText =
    money_per_month && currency ? (
      <>
        Empezá a ahorrar hasta{" "}
        <AppText weight="bold" style={{ color: colors.primary }}>
          {formatMoney(money_per_month * 12, currency)}
        </AppText>{" "}
        cada año
      </>
    ) : (
      "Convertí cada día sin fumar en dinero ahorrado"
    );

  function getWhyText(reason?: string) {
    switch (reason) {
      case "salud":
        return "priorizar tu salud";
      case "finanzas":
        return "recuperar tu libertad financiera";
      case "independencia":
        return "recuperar tu independencia";
      case "social":
        return "sentirte cómodo en situaciones sociales";
      case "crecimiento":
        return "crecer como persona y ganar disciplina";
      case "ansiedad":
        return "vivir con menos ansiedad";
      case "fitness":
        return "mejorar tu condición física";
      default:
        return "volver a sentirte en control";
    }
  }

  const primaryWhy = why_stopped?.[0];
  const whyText = (
    <>
      Te ayudaremos a{" "}
      <AppText weight="bold" style={{ color: colors.primary }}>
        {getWhyText(primaryWhy)}
      </AppText>
    </>
  );

  // ═══════════════════════════════════════════
  // PURCHASE: Triggers Apple's payment sheet
  // ═══════════════════════════════════════════
  async function handlePurchase() {
    const pkg = plan === "monthly" ? monthlyPkg : yearlyPkg;

    if (!pkg) {
      Alert.alert("Error", "No hay planes disponibles en este momento.");
      return;
    }

    try {
      setLoading(true);
      // This shows the native Apple payment sheet
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      // Check if "PuffZero Pro" entitlement is now active
      if (customerInfo.entitlements.active["PuffZero Pro"] !== undefined) {
        setIsPremium(true);
        completeOnboarding();
        resetAll();
        setAuthFlow(null);
        router.replace("/(app)/home");
      }
    } catch (e: any) {
      // userCancelled = user tapped "Cancel" on Apple's sheet — not an error
      if (!e.userCancelled) {
        Alert.alert(
          "Error",
          "No se pudo completar la compra. Intentá de nuevo.",
        );
        console.error("Purchase error:", e);
      }
    } finally {
      setLoading(false);
    }
  }

  // ═══════════════════════════════════════════
  // RESTORE: Required by Apple for App Store approval
  // ═══════════════════════════════════════════
  async function handleRestore() {
    try {
      setLoading(true);
      const customerInfo = await Purchases.restorePurchases();

      if (customerInfo.entitlements.active["PuffZero Pro"] !== undefined) {
        setIsPremium(true);
        completeOnboarding();
        resetAll();
        setAuthFlow(null);
        router.replace("/(app)/home");
      } else {
        Alert.alert("Info", "No se encontraron compras previas.");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudieron restaurar las compras.");
      console.error("Restore error:", e);
    } finally {
      setLoading(false);
    }
  }

  // ═══════════════════════════════════════════
  // DEV ONLY: Skip paywall for testing
  // ═══════════════════════════════════════════
  const devSkip = __DEV__
    ? () => {
        setIsPremium(true);
        completeOnboarding();
        resetAll();
        setAuthFlow(null);
        router.replace("/(app)/home");
      }
    : undefined;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <OnboardingHeader showProgress={false} showBack={false} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <AppText
            style={[layout.titleCenter, { color: colors.text }]}
            weight="bold"
          >
            {firstName ? (
              <>
                Hey{" "}
                <AppText weight="bold" style={{ color: colors.primary }}>
                  {firstName}
                </AppText>
                , desbloqueá Puff
              </>
            ) : (
              <>Hey, desbloqueá Puff</>
            )}
            <AppText weight="bold" style={{ color: colors.primary }}>
              Zero
            </AppText>{" "}
            para llegar a tu mejor versión.
          </AppText>

          <View style={styles.featureContainer}>
            <FeatureItem icon={Statistics} text={puffsText} />
            <FeatureItem icon={Target} text={planText} />
            <FeatureItem icon={Fire} text={whyText} />
            <FeatureItem icon={Check} text={moneyText} />
          </View>

          <View style={styles.featureContainer}>
            <SubscriptionOption
              title="Acceso mensual"
              subtitle="Cancelá cuando quieras"
              price={monthlyPrice}
              period="mes"
              selected={plan === "monthly"}
              onPress={() => setPlan("monthly")}
              style={{ marginBottom: 18 }}
            />

            <SubscriptionOption
              title="Acceso anual"
              subtitle="3 días de prueba gratis"
              price={yearlyPrice}
              period="año"
              badge="Ahorra 42%"
              highlight="Mejor oferta"
              selected={plan === "yearly"}
              onPress={() => setPlan("yearly")}
            />
          </View>

          <AppText style={[styles.disclosure, { color: colors.text }]}>
            Suscripción con renovación automática. Se cobrará el monto indicado
            a tu cuenta de Apple ID al confirmar la compra. Se renovará al mismo
            precio salvo que canceles al menos 24 horas antes del fin del
            período. Podés cancelar en cualquier momento desde Ajustes &gt;
            Apple ID &gt; Suscripciones.
          </AppText>

          <TouchableOpacity onPress={handleRestore} disabled={loading}>
            <AppText style={[styles.restoreText, { color: colors.text }]}>
              Restaurar compras
            </AppText>
          </TouchableOpacity>

          <View style={styles.legalLinks}>
            <AppText
              style={[styles.legalLink, { color: colors.primary }]}
              weight="semibold"
              onPress={() => router.push("/privacy-policy")}
            >
              Política de Privacidad
            </AppText>
            <AppText style={[styles.legalSep, { color: colors.text }]}>
              ·
            </AppText>
            <AppText
              style={[styles.legalLink, { color: colors.primary }]}
              weight="semibold"
              onPress={() => router.push("/terms-of-use")}
            >
              Términos de Uso
            </AppText>
          </View>
        </ScrollView>

        <ContinueButton
          text={
            loading
              ? "Procesando..."
              : !offersLoaded
                ? "Cargando planes..."
                : "Continuar"
          }
          onPress={handlePurchase}
          disabled={loading || !offersLoaded}
          style={layout.bottomButtonContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  featureContainer: {
    marginTop: 25,
  },
  restoreText: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 14,
    fontSize: 14,
  },
  disclosure: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.65,
    marginTop: 18,
    textAlign: "center",
  },
  legalLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  legalLink: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
  legalSep: {
    fontSize: 13,
    opacity: 0.5,
  },
  devSkipButton: {
    backgroundColor: "#FFD700",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    alignItems: "center",
  },
  devSkipText: {
    color: "#000",
    fontSize: 14,
  },
});
