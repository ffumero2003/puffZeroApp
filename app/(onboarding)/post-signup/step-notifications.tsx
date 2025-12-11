import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useCallback } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import NotificationsModal from "../../../assets/images/onboarding/notifications-modal.png";
import AppText from "../../../src/components/app-text";
import OnboardingHeader from "../../../src/components/onboarding/onboarding-header";
import { Colors } from "../../../src/constants/theme";
import { layout } from "../../../src/styles/layout";

export default function NotificationsStep() {

  // 👉 Función para pedir permisos nativos
  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      // status puede ser: "granted", "denied", "undetermined"
      console.log("Notification status:", status);

      // Independientemente del resultado → ir a step2
      router.push("/(onboarding)/post-signup/step2");
    } catch (err) {
      console.log("Error requesting notifications:", err);
      router.push("/(onboarding)/post-signup/step2");
    }
  }, []);

  // 👉 "Don't Allow" (NO se pide permiso)
  const skipPermission = () => {
    router.push("/(onboarding)/post-signup/step2");
  };

  return (
    <View style={layout.screenContainer}>

      {/* 🔵 HEADER FIJO ARRIBA — mismo estilo que las demás pantallas */}
      <OnboardingHeader
        step={0}
        total={11}
        showBack={false}
        showProgress={false}
      />

      {/* 🔵 SECCIÓN SUPERIOR — título + subtítulo */}
      <View style={styles.topSection}>
        <AppText weight="bold" style={layout.title}>
          Alcanza tus metas con{"\n"}recordatorios
        </AppText>

        <AppText weight="medium" style={layout.subtitle}>
          Un pequeño recordatorio puede marcar la diferencia en tu día.
        </AppText>
      </View>

      {/* 🟣 SECCIÓN CENTRAL — mockCard */}
      <View style={styles.middleSection}>
        <View style={styles.mockCard}>

          <AppText weight="semibold" style={styles.appName}>
            “Puff
            <AppText
              weight="extrabold"
              style={layout.link}
            >
              Zero
            </AppText>
            ” quiere enviarte notificaciones
          </AppText>

          <AppText weight="regular" style={styles.mockDescription}>
            Pueden incluir alertas, recordatorios, sonidos o insignias.{"\n"}
            Podés desactivarlas cuando querás desde Configuración.
          </AppText>

          <View style={styles.buttonsRow}>

            {/* Don't Allow */}
            <Pressable 
              onPress={skipPermission}
              style={[styles.btnOption, { backgroundColor: "#E7E7E7" }]}
            >
              <AppText weight="semibold" style={[styles.btnText, { color: "#000" }]}>
                Don't Allow
              </AppText>
            </Pressable>

            {/* Allow */}
            <Pressable
              onPress={requestPermission}
              style={[styles.btnOptionAllow, { backgroundColor: Colors.light.primary }]}
            >
              <AppText weight="semibold" style={[styles.btnTextAllow, { color: "#fff" }]}>
                Allow
              </AppText>
            </Pressable>

          </View>
        </View>
      </View>

      {/* 🟢 IMAGEN INFERIOR */}
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
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 20,
      width: "92%",
      alignSelf: "center",

      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },

    appName: {
      fontSize: 16,
      marginBottom: 8,
      color: Colors.light.text,
    },

    mockDescription: {
      fontSize: 14,
      color: Colors.light.textSecondary,
      lineHeight: 18,
      marginBottom: 20,
    },

    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    btnOption: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
      width: "48%",
      alignItems: "center",
    },

    btnText: {
      fontSize: 15,
      
    },

    btnOptionAllow: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 0,
      width: "48%",
      alignItems: "center",
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
