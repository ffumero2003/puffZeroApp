import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "../../src/components/appText";
import KeepGoingButton from "../../src/components/onboarding/keepGoingButton";
import UnderlineInput from "../../src/components/onboarding/underlineInput";
import { Colors } from "../../src/constants/theme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back-outline" size={28} color={Colors.light.text} />
      </TouchableOpacity>

      {/* Title */}
      <AppText weight="bold" style={styles.title}>
        ¿Olvidaste tu contraseña?
      </AppText>

      {/* Subtitle */}
      <AppText style={styles.subtitle}>
        Ingresá tu correo y te enviaremos un enlace{"\n"}para restablecerla.
      </AppText>

      

      <UnderlineInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Button */}
      <View style={{ marginTop: "auto", marginBottom: 40 }}>
        <KeepGoingButton
          text="Restablecer contraseña"
          onPress={() => {}}
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
    paddingTop: 50,
  },

  backBtn: {
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.light.textMuted,
    marginBottom: 40,
    lineHeight: 22,
  },

  label: {
    fontSize: 16,
    color: Colors.light.textMuted,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#E6E4FF",
    height: 45,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
    fontFamily: "Manrope_400Regular",
  },

 

});
