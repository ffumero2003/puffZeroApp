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
import { Colors } from "@/src/constants/theme";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { layout } from "@/src/styles/layout";
import { useOnboardingPaywallViewModel } from "@/src/viewmodels/onboarding/useOnboardingPaywallViewModel";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";



export default function OnboardingPaywall() {
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
    resetAll
  } = useOnboarding();
  const { user } = useAuth();

  const { formatMoney } = useOnboardingPaywallViewModel();
  const [plan, setPlan] = useState<"weekly" | "yearly">("yearly");

  const displayName = name || 
                    (user?.user_metadata?.full_name as string | undefined) || 
                    undefined;

  const firstName = displayName?.trim().split(" ")[0];

  const puffsText = puffs_per_day ? (
    <>
      Registrá tu progreso diario partiendo de{" "}
      <AppText weight="bold" style={{ color: Colors.light.primary }}>
        {puffs_per_day} puffs
      </AppText>
    </>
  ) : (
    "Registrá tu progreso diario y visualizá cada avance"
  );

  const planText = goal_speed ? (
    <>
      No es fuerza de voluntad: es un plan claro de{" "}
      <AppText weight="bold" style={{ color: Colors.light.primary }}>
        {goal_speed} días
      </AppText>
    </>
  ) : (
    "Tu plan está diseñado para que avances paso a paso con claridad"
  );


  const trackingText =
  "Seguí tu plan día a día sin confusión ni complicaciones";

  const moneyText = money_per_month && currency ? (
    <>
      Empezá a ahorrar hasta{" "}
      <AppText weight="bold" style={{ color: Colors.light.primary }}>
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
      <AppText weight="bold" style={{ color: Colors.light.primary }}>
        {getWhyText(primaryWhy)}
      </AppText>
    </>
  );




  function grantAccess() {
    completeOnboarding(); // marca onboarding como terminado
    resetAll();           // limpia datos temporales
    router.replace("/(app)/home");
  }

    
  return (
    <ScreenWrapper>
      <View style={layout.screenContainer}>
        <View >   
            {/* Header */}
          <OnboardingHeader showProgress={false} showBack={false} />

          <AppText style={layout.titleCenter} weight="bold">
            {firstName ? (
              <>
                Hey{" "}
                <AppText weight="bold" style={{ color: Colors.light.primary }}>
                  {firstName}
                </AppText>
                , desbloqueá Puff
              </>
            ) : (
              <>Hey, desbloqueá Puff</>
            )}
            <AppText weight="bold" style={{ color: Colors.light.primary }}>
              Zero
            </AppText>{" "}
            para llegar a tu mejor versión.
          </AppText>

            <View style={styles.featureContainer}>

              <FeatureItem icon={Statistics} text={puffsText}/> 
              <FeatureItem icon={Target} text={planText} /> 
              <FeatureItem icon={Fire} text={whyText} /> 
              <FeatureItem icon={Check} text={moneyText} /> 
          </View>


          <View style={styles.featureContainer}>
              <SubscriptionOption
              title="Acceso semanal"
              subtitle="3 días de prueba gratis"
              price="₡5,000"
              strikePrice={true}
              highlight="Mejor oferta"
              badge="GRATIS"
              selected={plan === "weekly"}
              onPress={() => setPlan("weekly")}
            />

            <SubscriptionOption
              title="Acceso anual"
              subtitle="3 días de prueba gratis"
              price="₡700"
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

            
        </View> 
      
              
      </View>
    </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
  featureContainer: {
    marginTop: 25
  }
})
