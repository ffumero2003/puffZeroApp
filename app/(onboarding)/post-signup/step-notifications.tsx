// notifications-step.tsx
import NotificationsModal from "@/assets/images/onboarding/notifications-modal.png";
import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

import ScreenWrapper from "@/src/components/system/ScreenWrapper";
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
    <ScreenWrapper>
      <View style={layout.containerWithLoadingBar}>
        

        <View style={layout.contentNotifications}>
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

        <View style={layout.bottomButtonContainer}>
          <Image
            source={NotificationsModal}
            style={layout.headerImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  mockCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.20,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android shadow
    elevation: 6,
  },

  appName: {
    fontSize: 20,
    lineHeight: 22,
    color: "#000",
    marginBottom: 12,
  },

  mockDescription: {
    fontSize: 16,
    lineHeight: 20,
    color: "#444",
    marginBottom: 20,
  },

  buttonsRow: {
    flexDirection: "row",
    gap: 12,
  },

  btnOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  btnOptionAllow: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
  },

});
