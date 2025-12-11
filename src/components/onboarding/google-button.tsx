import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import { components } from "../../../src/styles/components";
import AppText from "../app-text";

import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectTo = "puffzero://auth/callback";

  console.log("Redirect URI:", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        prompt: "consent",
        access_type: "offline",
        include_granted_scopes: "true",
      },
    },
  });

  console.log("🔍 OAuth DATA RAW:", data);
  console.log("🔍 OAuth ERROR RAW:", error);

  if (error) return;

  const finalUrl = data?.url;

  console.log("🌎 FINAL AUTH URL:", finalUrl);

  if (finalUrl) {
    console.log("🌎 Opening browser:", finalUrl);
    await WebBrowser.openAuthSessionAsync(finalUrl, redirectTo);
  }
}



export default function GoogleButton() {
  return (
    <TouchableOpacity
      style={components.googleBtn}
      activeOpacity={0.7}
      onPress={signInWithGoogle}
    >
      <Ionicons name="logo-google" size={20} color="#fff" />
      <AppText weight="semibold" style={components.googleText}>
        Continuar con Google
      </AppText>
    </TouchableOpacity>
  );
}
