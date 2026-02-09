// notifications-step.tsx
import NotificationsModal from "@/assets/images/onboarding/notifications-modal.png";
import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useNotificationsViewModel } from "@/src/viewmodels/onboarding/useNotificationsViewModel";

export default function NotificationsStep() {
  const colors = useThemeColors();
  const { requestPermission, skipPermission } = useNotificationsViewModel();

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
      <View
        style={[
          layout.containerWithLoadingBar,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={layout.contentNotifications}>
          <AppText weight="bold" style={[layout.title, { color: colors.text }]}>
            Alcanza tus metas con{"\n"}recordatorios
          </AppText>

          <AppText
            weight="medium"
            style={[layout.subtitle, { color: colors.text }]}
          >
            Un pequeño recordatorio puede marcar la diferencia en tu día.
          </AppText>
        </View>

        <View style={styles.middleSection}>
          <View
            style={[
              styles.mockCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
          >
            <AppText
              weight="semibold"
              style={[styles.appName, { color: colors.text }]}
            >
              “Puff
              <AppText weight="extrabold" style={{ color: colors.primary }}>
                Zero
              </AppText>
              ” quiere enviarte notificaciones
            </AppText>

            <AppText
              weight="regular"
              style={[styles.mockDescription, { color: colors.textMuted }]}
            >
              Pueden incluir alertas, recordatorios, sonidos o insignias.{"\n"}
              Podés desactivarlas cuando querás desde Configuración.
            </AppText>

            <View style={styles.buttonsRow}>
              <Pressable
                onPress={handleSkip}
                style={[
                  styles.btnOption,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <AppText weight="semibold" style={{ color: colors.text }}>
                  Don't Allow
                </AppText>
              </Pressable>

              <Pressable
                onPress={handleAllow}
                style={[
                  styles.btnOptionAllow,
                  { backgroundColor: colors.primary },
                ]}
              >
                <AppText weight="semibold" style={{ color: colors.textWhite }}>
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
    borderRadius: 24,
    padding: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    // Android shadow
    elevation: 6,
  },

  appName: {
    fontSize: 20,
    lineHeight: 22,
    marginBottom: 12,
  },

  mockDescription: {
    fontSize: 16,
    lineHeight: 20,
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
  },
});
