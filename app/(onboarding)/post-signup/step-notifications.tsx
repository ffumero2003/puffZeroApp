// notifications-step.tsx
import { router } from "expo-router";
import { Image, Pressable, View } from "react-native";

import NotificationsModal from "@/assets/images/onboarding/notifications-modal.png";
import AppText from "@/src/components/AppText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { ROUTES } from "@/src/constants/routes";
import { layout } from "@/src/styles/layout";

import { useNotificationsViewModel } from "@/src/viewmodels/onboarding/useNotificationsViewModel";

export default function NotificationsStep() {
  const { requestPermission, skipPermission } =
    useNotificationsViewModel();

  const goNext = () => {
    router.push(ROUTES.POST_SIGNUP_PERCENTAGE);
  };

  const handleAllow = async () => {
    await requestPermission();
    goNext();
  };

  const handleSkip = () => {
    skipPermission();
    goNext();
  };

  return (
    <View style={layout.screenContainer}>
      <OnboardingHeader
        step={0}
        total={11}
        showBack={false}
        showProgress={false}
      />

      <View style={styles.topSection}>
        <AppText weight="bold" style={layout.title}>
          Alcanza tus metas con{"\n"}recordatorios
        </AppText>

        <AppText weight="medium" style={layout.subtitle}>
          Un pequeño recordatorio puede marcar la diferencia en tu día.
        </AppText>
      </View>

      <View style={styles.middleSection}>
        <View style={styles.mockCard}>
          <AppText weight="semibold" style={styles.appName}>
            “Puff
            <AppText weight="extrabold" style={layout.link}>
              Zero
            </AppText>
            ” quiere enviarte notificaciones
          </AppText>

          <AppText weight="regular" style={styles.mockDescription}>
            Pueden incluir alertas, recordatorios, sonidos o insignias.{"\n"}
            Podés desactivarlas cuando querás desde Configuración.
          </AppText>

          <View style={styles.buttonsRow}>
            <Pressable
              onPress={handleSkip}
              style={[styles.btnOption, { backgroundColor: "#E7E7E7" }]}
            >
              <AppText weight="semibold" style={{ color: "#000" }}>
                Don't Allow
              </AppText>
            </Pressable>

            <Pressable
              onPress={handleAllow}
              style={styles.btnOptionAllow}
            >
              <AppText weight="semibold" style={{ color: "#fff" }}>
                Allow
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Image
          source={NotificationsModal}
          style={layout.headerImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
