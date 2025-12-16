import { useAuth } from "@/src/providers/auth-provider";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import OnboardingOptionCard from "@/src/components/onboarding/OnboardingOptionCard";
import TitleBlock from "@/src/components/onboarding/TitleBlock";
import { ROUTES } from "@/src/constants/routes";
import { useSubscription } from "@/src/providers/subscription-provider";
import { layout } from "@/src/styles/layout";

const PAYWALL_OPTIONS = [
  {
    id: "monthly",
    badge: "3 DÍAS GRATIS",
    title: "Acceso mensual",
    description: "Luego ₡X.XXX / mes",
  },
  {
    id: "yearly",
    badge: "MEJOR OFERTA",
    title: "Acceso anual",
    description: "3 días gratis • Ahorra hasta 90%",
  },
];

export default function OnboardingPaywall() {
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  const { grantAccess } = useSubscription();
  const { firstName, initializing } = useAuth();


  function handleStartTrial() {
    if (__DEV__) {
      console.log("Trial started for:", selected);
      grantAccess(); // mock
      router.replace(ROUTES.TABS_HOME);
    }
  }

  const greetingName = firstName || "ahí";

  return (
    <View style={layout.screenContainer}>
      <View>
        <OnboardingHeader step={10} total={11} showBack={false} showProgress={false} />

        <View style={layout.content}>
          <TitleBlock
            title={`Hey ${greetingName}, desbloquea PuffZero`}
            subtitle="para llegar a tu mejor versión."
          />

          {PAYWALL_OPTIONS.map((opt) => (
            <OnboardingOptionCard
              key={opt.id}
              id={opt.id}
              title={`${opt.title} • ${opt.badge}`}
              description={opt.description}
              selected={selected === opt.id}
              onPress={() => setSelected(opt.id as "monthly" | "yearly")}
            />
          ))}
        </View>
      </View>

      <ContinueButton
        text="Comenzar prueba gratis"
        onPress={handleStartTrial}
        style={layout.bottomButtonContainer}
      />
    </View>
  );
}
