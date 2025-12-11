import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from "react-native";

import AppText from "../../src/components/app-text";
import AuthHeader from "../../src/components/auth/auth-header";
import ContinueButtonAuth from "../../src/components/auth/continueButtonAuth";
import GoogleButton from "../../src/components/onboarding/google-button";
import OnboardingHeader from "../../src/components/onboarding/onboarding-header";
import SeparatorRow from "../../src/components/onboarding/separator-row";
import UnderlineInput from "../../src/components/onboarding/underline-input";

import { layout } from "@/src/styles/layout";
import { createProfile } from "../../src/lib/profile";
import { useAuth } from "../../src/providers/auth-provider";
import { useOnboarding } from "../../src/providers/onboarding-provider"; // 👈 ESTA es la correcta

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nombreError, setNombreError] = useState("");

  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");


  // Supabase Auth
  const { signUp } = useAuth();

  // 🔥 Onboarding context — SE USA AQUÍ, NO DENTRO DE LA FUNCIÓN
  const {
    puffs_per_day,
    money_per_month,
    currency,
    goal,
    goal_speed,
    why_stopped,
    worries,
    resetAll,
  } = useOnboarding();

  // ---------------------------
  //   HANDLE REGISTER
  // ---------------------------
  async function handleRegister() {
    // 1) Crear usuario en Auth
    const { data, error } = await signUp(email, password, nombre);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    const user_id = data?.user?.id;

    if (!user_id) {
      Alert.alert("Error", "No se pudo obtener el usuario.");
      return;
    }

    // 2) Crear perfil en Supabase con datos reales del onboarding
    const { error: profileError } = await createProfile({
      user_id,
      full_name: nombre,
      puffs_per_day,
      money_per_month,
      currency,
      goal,
      goal_speed,
      why_stopped,
      worries,
    });

    if (profileError) {
      Alert.alert("Error creando perfil", profileError.message);
      return;
    }

    // 3) Limpiar estado del onboarding
    resetAll();

    Alert.alert("Cuenta creada", "Revisá tu correo para confirmar tu cuenta.");
    // Redirige al paso de review dentro del grupo de onboarding
    router.push("/(onboarding)/post-signup/step-review");
  }

  /* ---------------------------
     VALIDACIONES
  ------------------------------*/

  const validateNombre = (value: string) => {
    setNombre(value);

    const trimmed = value.trim();

    if (!trimmed) {
      setNombreError("Este campo es obligatorio.");
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(trimmed)) {
      setNombreError("Solo se permiten letras.");
      return;
    }

    const partes = trimmed.split(" ");

    if (partes.length < 2) {
      setNombreError("Incluí nombre y apellido.");
      return;
    }

    if (partes.some((p) => p.length < 2)) {
      setNombreError("Cada nombre/apellido debe tener al menos 2 letras.");
      return;
    }

    setNombreError("");
  };

  const validateEmail = (value: string) => {
    setEmail(value.trim());

    if (!value.trim()) {
      setEmailError("Este campo es obligatorio.");
      return;
    }

    if (/\s/.test(value)) {
      setEmailError("El correo no puede tener espacios.");
      return;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
      setEmailError("Correo inválido.");
      return;
    }

    setEmailError("");
  };

  const validatePassword = (value: string) => {
    setPassword(value);

    if (!value.trim()) {
      setPasswordError("Este campo es obligatorio.");
      return;
    }

    if (/\s/.test(value)) {
      setPasswordError("La contraseña no puede contener espacios.");
      return;
    }

    if (value.length < 6) {
      setPasswordError("Mínimo 6 caracteres.");
      return;
    }

    if (!/[0-9]/.test(value)) {
      setPasswordError("Debe incluir al menos un número.");
      return;
    }

    if (!/[A-Za-z]/.test(value)) {
      setPasswordError("Debe incluir al menos una letra.");
      return;
    }


    setPasswordError("");

    if (confirm && value !== confirm) {
      setConfirmError("Las contraseñas no coinciden.");
    } else {
      setConfirmError("");
    }
  };

  const validateConfirm = (value: string) => {
    setConfirm(value);

    if (value !== password) {
      setConfirmError("Las contraseñas no coinciden.");
    } else {
      setConfirmError("");
    }
  };


  const isInvalid =
    !email ||
    !password ||
    !confirm ||
    !nombre ||
    emailError ||
    passwordError ||
    nombreError ||
    confirmError;


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={layout.containerAuth}>

        <OnboardingHeader showProgress={false} style={{ marginBottom: 30 }} />

        <AuthHeader
          title="Crear Cuenta"
          subtitle="Configurá tu cuenta y empezá tu proceso."
        />

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Nombre */}
          <UnderlineInput
            placeholder="Nombre Completo"
            value={nombre}
            onChangeText={validateNombre}
            autoCapitalize="none"
            keyboardType="default"
          />
          {nombreError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {nombreError}
            </AppText>
          ) : null}

          {/* Email */}
          <UnderlineInput
            placeholder="Correo"
            value={email}
            onChangeText={validateEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {emailError}
            </AppText>
          ) : null}

          {/* Contraseña */}
          <UnderlineInput
            placeholder="Contraseña"
            value={password}
            onChangeText={validatePassword}
            autoCapitalize="none"
            secureTextEntry
          />
          {passwordError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {passwordError}
            </AppText>
          ) : null}

          {/* Confirmar contraseña — NUEVO 🔥 */}
          <UnderlineInput
            placeholder="Confirmar contraseña"
            value={confirm}
            onChangeText={validateConfirm}
            autoCapitalize="none"
            secureTextEntry
            style={{ marginTop: 16 }}
          />
          {confirmError ? (
            <AppText style={layout.errorText} weight="extrabold">
              {confirmError}
            </AppText>
          ) : null}

          {/* Botón de registro */}
          <ContinueButtonAuth
            text="Registrarse"
            disabled={isInvalid}
            onPress={handleRegister}
            style={{ marginTop: 30 }}
          />

          <SeparatorRow />

          <GoogleButton />

        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );

}


