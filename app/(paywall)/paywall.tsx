import Check from "@/assets/images/paywall/check.png";
import Fire from "@/assets/images/paywall/fire.png";
import Statistics from "@/assets/images/paywall/statistics.png";
import Target from "@/assets/images/paywall/target.png";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import FeatureItem from "@/src/components/paywall/FeatureItem";
import SubscriptionOption from "@/src/components/paywall/SubscriptionOption";
import { BYPASS_PAYWALL } from "@/src/config/dev";
import {
  BASE_PRICES_CRC,
  CRC_EXCHANGE_RATES,
  CURRENCY_SYMBOLS,
} from "@/src/constants/currency";
import { useThemeColors } from "@/src/providers/theme-provider";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { layout } from "@/src/styles/layout";
import { useOnboardingPaywallViewModel } from "@/src/viewmodels/onboarding/useOnboardingPaywallViewModel";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Paywall() {
  // const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  // const { grantAccess } = useSubscription();

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
  const { user, setAuthFlow, setIsPremium } = useAuth();

  // Calculate converted prices
  const userCurrency = currency || "CRC";
  const exchangeRate = CRC_EXCHANGE_RATES[userCurrency] || 1;
  const currencySymbol = CURRENCY_SYMBOLS[userCurrency] || "₡";

  const weeklyPrice = Math.round(BASE_PRICES_CRC.weekly * exchangeRate);
  const yearlyPrice = Math.round(BASE_PRICES_CRC.yearly * exchangeRate);

  const formattedWeeklyPrice = `${currencySymbol}${weeklyPrice.toLocaleString()}`;
  const formattedYearlyPrice = `${currencySymbol}${yearlyPrice.toLocaleString()}`;

  // console.log("🔍 PAYWALL DEBUG:", {
  //   currency,
  //   userCurrency,
  //   exchangeRate,
  //   currencySymbol,
  //   weeklyPrice,
  //   formattedWeeklyPrice,
  //   yearlyPrice,
  //   formattedYearlyPrice,
  // });

  const { formatMoney } = useOnboardingPaywallViewModel();
  const [plan, setPlan] = useState<"weekly" | "yearly">("yearly");
  const colors = useThemeColors();

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

  const trackingText =
    "Seguí tu plan día a día sin confusión ni complicaciones";

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

  function grantAccess() {
    // ┌─────────────────────────────────────────────────────────┐
    // │ PRODUCTION: This should ONLY be called after a          │
    // │ successful RevenueCat/payment purchase confirmation.     │
    // │ Right now it grants access directly for dev purposes.    │
    // └─────────────────────────────────────────────────────────┘
    setIsPremium(true); // Mark user as premium → AuthGuard lets them into (app)
    completeOnboarding(); // Mark onboarding as completed
    resetAll(); // Clear temporary onboarding data
    setAuthFlow(null); // Reset authFlow so AuthGuard doesn't block
    router.replace("/(app)/home");
  }

  return (
    <View style={layout.screenContainer}>
      <View>
        {/* Header */}
        <OnboardingHeader showProgress={false} showBack={false} />

        <AppText style={layout.titleCenter} weight="bold">
          {firstName ? (
            <>
              Hey{" "}
              <AppText weight="bold" style={{ color: colors.primary }}>
                {firstName}
              </AppText>
              , desbloqueá Puff
            </>
          ) : (
            <>Hey, desbloqueá PuffHOME</>
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
            title="Acceso semanal"
            subtitle="3 días de prueba gratis"
            price={formattedWeeklyPrice} // Dynamic now
            strikePrice={true}
            highlight="Mejor oferta"
            badge="GRATIS"
            selected={plan === "weekly"}
            onPress={() => setPlan("weekly")}
          />

          <SubscriptionOption
            title="Acceso anual"
            subtitle="3 días de prueba gratis"
            price={formattedYearlyPrice} // Dynamic now
            strikePrice={false}
            badge="Ahorra 90%"
            selected={plan === "yearly"}
            onPress={() => setPlan("yearly")}
          />
        </View>

        <ContinueButton
          text="Continuar"
          onPress={grantAccess}
          style={layout.bottomButtonContainer}
        />

        {/* 🔧 DEV: Skip paywall button - visible when BYPASS_PAYWALL = false but still in dev */}
        {__DEV__ && !BYPASS_PAYWALL && (
          <TouchableOpacity
            style={styles.devSkipButton}
            onPress={grantAccess}
            activeOpacity={0.7}
          >
            <AppText weight="bold" style={styles.devSkipText}>
              🔧 SKIP PAYWALL (DEV)
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featureContainer: {
    marginTop: 25,
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
