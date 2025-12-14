import { Image, Pressable, StyleSheet, View } from "react-native";

import NotificationsModal from "@/assets/images/onboarding/notifications-modal.png";
import AppText from "@/src/components/AppText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";

import { useNotificationsViewModel } from "@/src/viewmodels/onboarding/useNotificationsViewModel";

export default function NotificationsStep() {
  const { requestPermissionAndContinue, skipPermission } =
    useNotificationsViewModel();

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
              onPress={skipPermission}
              style={[styles.btnOption, { backgroundColor: "#E7E7E7" }]}
            >
              <AppText weight="semibold" style={{ color: "#000" }}>
                Don't Allow
              </AppText>
            </Pressable>

            <Pressable
              onPress={requestPermissionAndContinue}
              style={[
                styles.btnOptionAllow,
                { backgroundColor: Colors.light.primary },
              ]}
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



  // 🎨 STYLES
  const styles = StyleSheet.create({
    

    // 🔵 TOP: título + subtítulo
    topSection: {
      flex: 1,
      justifyContent: "flex-start",
      paddingTop: 50,
    },


    // 🟣 MIDDLE: mockCard centrado perfectamente
    middleSection: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    mockCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 26,
      padding: 32,
      width: "96%",
      alignSelf: "center",
      marginVertical: 28,

      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.08)",

      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 14 },

      elevation: 14,
    },
  


    appName: {
      fontSize: 18,
      marginBottom: 8,
      color: Colors.light.text,
    },

    mockDescription: {
      fontSize: 16,
      color: Colors.light.textSecondary,
      lineHeight: 22,
      marginBottom: 20,
    },

    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

   btnOption: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
      width: "48%",
      alignItems: "center",
      backgroundColor: "#E5E0FF",
    },

    btnText: {
      fontSize: 15,
      
    },

    
    btnOptionAllow: {
      paddingVertical: 12,
      paddingHorizontal: 18,
      
      width: "48%",
      alignItems: "center",
      backgroundColor: Colors.light.primary,
    },

    btnTextAllow: {
      fontSize: 15,
      
    },

    // 🟢 BOTTOM: imagen pegada abajo
    bottomSection: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      paddingBottom: 30,
    },

   
  });
