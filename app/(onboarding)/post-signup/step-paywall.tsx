// app/(onboarding)/post-signup/step-paywall.tsx
import Check from "@/assets/images/paywall/check.png";
import Fire from "@/assets/images/paywall/fire.png";
import Statistics from "@/assets/images/paywall/statistics.png";
import Target from "@/assets/images/paywall/target.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import FeatureItem from "@/src/components/paywall/FeatureItem";
import SubscriptionOption from "@/src/components/paywall/SubscriptionOption";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import {
  BASE_PRICES_CRC,
  CRC_EXCHANGE_RATES,
  CURRENCY_SYMBOLS,
} from "@/src/constants/currency";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useOnboardingPaywallViewModel } from "@/src/viewmodels/onboarding/useOnboardingPaywallViewModel";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

// RevenueCat
import Purchases, { PurchasesPackage } from "react-native-purchases";

export default function OnboardingPaywall() {
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
  const { user, setAuthFlow, setIsPremium, setPostSignupCompleted } = useAuth();

  const { formatMoney } = useOnboardingPaywallViewModel();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const colors = useThemeColors();

  // Fallback prices
  const userCurrency = currency || "CRC";
  const exchangeRate = CRC_EXCHANGE_RATES[userCurrency] || 1;
  const currencySymbol = CURRENCY_SYMBOLS[userCurrency] || "₡";
  const fallbackMonthly = `${currencySymbol}${Math.round(
    BASE_PRICES_CRC.weekly * exchangeRate
  ).toLocaleString()}`;
  const fallbackYearly = `${currencySymbol}${Math.round(
    BASE_PRICES_CRC.yearly * exchangeRate
  ).toLocaleString()}`;

  // RevenueCat state
  const [loading, setLoading] = useState(false);
  const [monthlyPkg, setMonthlyPkg] = useState<PurchasesPackage | null>(null);
  const [yearlyPkg, setYearlyPkg] = useState<PurchasesPackage | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState(fallbackMonthly);
  const [yearlyPrice, setYearlyPrice] = useState(fallbackYearly);

  // Load real prices from RevenueCat
  useEffect(() => {
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
      }
    };
    loadOfferings();
  }, []);

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

  // Purchase handler
  async function handlePurchase() {
    const pkg = plan === "monthly" ? monthlyPkg : yearlyPkg;
    if (!pkg) {
      Alert.alert("Error", "No hay planes disponibles en este momento.");
      return;
    }

    try {
      setLoading(true);
      const { customerInfo } = await Purchases.purchasePackage(pkg);

      if (customerInfo.entitlements.active["PuffZero Pro"] !== undefined) {
        setIsPremium(true);
        completeOnboarding();
        resetAll();
        setAuthFlow(null);
        setPostSignupCompleted(true);
        router.replace("/(app)/home");
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert(
          "Error",
          "No se pudo completar la compra. Intentá de nuevo."
        );
        console.error("Purchase error:", e);
      }
    } finally {
      setLoading(false);
    }
  }

  // Restore handler
  async function handleRestore() {
    try {
      setLoading(true);
      const customerInfo = await Purchases.restorePurchases();

      if (customerInfo.entitlements.active["PuffZero Pro"] !== undefined) {
        setIsPremium(true);
        completeOnboarding();
        resetAll();
        setAuthFlow(null);
        setPostSignupCompleted(true);
        router.replace("/(app)/home");
      } else {
        Alert.alert("Info", "No se encontraron compras previas.");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudieron restaurar las compras.");
    } finally {
      setLoading(false);
    }
  }

  function devSkip() {
    setIsPremium(true);
    completeOnboarding();
    resetAll();
    setAuthFlow(null);
    setPostSignupCompleted(true);
    router.replace("/(app)/home");
  }

  return (
    <ScreenWrapper>
      <View
        style={[layout.screenContainer, { backgroundColor: colors.background }]}
      >
        <View>
          <OnboardingHeader showProgress={false} showBack={false} />

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
              selected={plan === "monthly"}
              onPress={() => setPlan("monthly")}
            />

            <SubscriptionOption
              title="Acceso anual"
              subtitle="3 días de prueba gratis"
              price={yearlyPrice}
              badge="Ahorra 42%"
              highlight="Mejor oferta"
              selected={plan === "yearly"}
              onPress={() => setPlan("yearly")}
            />
          </View>
        </View>

        <View>
          <ContinueButton
            text={loading ? "Procesando..." : "Continuar"}
            onPress={handlePurchase}
            style={layout.bottomButtonContainer}
          />

          <TouchableOpacity onPress={handleRestore} disabled={loading}>
            <AppText style={[styles.restoreText, { color: colors.text }]}>
              Restaurar compras
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  featureContainer: {
    marginTop: 25,
  },
  restoreText: {
    textAlign: "center",
    opacity: 0.5,
    marginTop: 14,
    fontSize: 14,
  },
});
