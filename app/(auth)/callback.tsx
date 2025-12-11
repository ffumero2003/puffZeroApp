import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../../src/lib/supabase";

export default function Callback() {
  useEffect(() => {
    async function finishOAuth() {
      console.log("🔄 Callback mounted — finishing OAuth…");

      WebBrowser.dismissBrowser();

      // 1️⃣ Obtener la URL con el code/token
      const url = await Linking.getInitialURL();
      console.log("🔗 Callback URL:", url);

      if (url) {
        // 2️⃣ Intercambiar el code por la sesión real
        const { data, error } = await supabase.auth.exchangeCodeForSession(url);

        if (error) {
          console.log("❌ Error exchanging code:", error);
          router.replace("/(auth)/login");
          return;
        }

        console.log("🔥 Session created:", data.session);

        // 3️⃣ Si tiene usuario -> avanzar
        if (data.session?.user) {
          router.replace("/(onboarding)/onboarding");
          return;
        }
      }

      // Si algo falla → login
      router.replace("/(auth)/login");
    }

    finishOAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator size="large" color="#6C47FF" />
    </View>
  );
}
