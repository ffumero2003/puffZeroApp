import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import Logo from "../assets/images/logoPuffZeroCircle.png";
import { Colors } from "../src/constants/theme";

// Simulación de carga de datos del usuario
async function loadUserData() {
  return new Promise((resolve) => setTimeout(resolve, 1500));
}

export default function Splash() {
  const [timerDone, setTimerDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    
    // 1️⃣ Timer mínimo
    const timer = setTimeout(() => setTimerDone(true), 3000);

    // 2️⃣ Carga simulada
    loadUserData().then(() => setDataLoaded(true));

    return () => clearTimeout(timer);
  }, []);

    useEffect(() => {
    if (timerDone && dataLoaded) {
      router.replace("./(auth)/onboarding/onboarding");
    }
  }, [timerDone, dataLoaded]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <View style={{ alignItems: "center" }}>
        <Image source={Logo} style={{ width: 200, height: 200 }} />

        <Text
          style={{
            marginTop: 20,
            fontSize: 30,
            color: Colors.light.text,
            fontWeight: "700",
            textAlign: "center",
            lineHeight: 35,
            paddingHorizontal: 80,
          }}
        >
          Consigue tu mejor versión
        </Text>
      </View>

      <ActivityIndicator
        size="large"
        color={Colors.light.primary}
        style={{ marginTop: 40 }}
      />

      <Text
        style={{
          position: "absolute",
          bottom: 30,
          color: Colors.light.textSecondary,
          fontSize: 16,
          fontWeight: "600",
        }}
      >
        PuffZero — Para de fumar
      </Text>
    </View>
  );
}
