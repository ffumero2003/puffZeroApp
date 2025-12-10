import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import AppText from "../src/components/app-text";
import KeepGoingButton from "../src/components/onboarding/keep-going-button";
import UnderlineInput from "../src/components/onboarding/underline-input";
import { Colors } from "../src/constants/theme";
import { supabase } from "../src/lib/supabase";

export default function ResetPasswordScreen() {
  const { token: rawToken } = useLocalSearchParams();
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // ❗ Activar sesión de recuperación
  useEffect(() => {
    const activateRecovery = async () => {
      if (!token) return;

      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });

      if (error) {
        console.log("Error al activar sesión de recuperación:", error);
      } else {
        console.log("Sesión de recuperación activada.");
      }
    };

    activateRecovery();
  }, [token]);


  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Error", "Token inválido.");
      return;
    }

    if (!password || !confirm) {
      Alert.alert("Error", "Completá ambos campos.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    // 🔥 Ahora ya podés actualizar la contraseña
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Listo", "Tu contraseña fue actualizada.");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Crear nueva contraseña
      </AppText>

      <UnderlineInput
        placeholder="Nueva contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <UnderlineInput
        placeholder="Confirmar contraseña"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={{ marginTop: 16 }}
      />

      <View style={{ marginTop: 40 }}>
        <KeepGoingButton
          text={loading ? "Actualizando..." : "Actualizar contraseña"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 40,
  },
});
