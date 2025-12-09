import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import AppText from "../../src/components/app-text";
import KeepGoingButton from "../../src/components/onboarding/keep-going-button";
import UnderlineInput from "../../src/components/onboarding/underline-input";
import { Colors } from "../../src/constants/theme";
import { supabase } from "../../src/lib/supabase";
import { updatePassword } from "../../src/services/auth-services";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Capturar token del deep link al abrir esta pantalla
  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (!url) return;

      // Parsear URL
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.access_token;

      if (token) {
        // Restaurar sesión temporal (recovery mode)
        const { error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token,
        });

        if (error) {
          console.log("Error al setear sesión:", error);
        } else {
          console.log("Sesión restaurada para reset de contraseña");
        }
      }
    };

    handleDeepLink();
  }, []);

  const handleSubmit = async () => {
    if (!password || !confirm) {
      Alert.alert("Error", "Completá ambos campos.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Listo",
        "Tu contraseña fue actualizada con éxito. Ahora podés iniciar sesión."
      );
    }
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
