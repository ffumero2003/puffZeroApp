import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import UnderlineInput from "@/src/components/onboarding/UnderlineInput";
import {
  validateConfirmPassword,
  validatePassword,
} from "@/src/lib/auth/auth.validation";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useResetPasswordViewModel } from "@/src/viewmodels/auth/useResetPasswordViewModel";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  const colors = useThemeColors();
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const { password, confirm, loading, setPassword, setConfirm, submit, ready } =
    useResetPasswordViewModel();
  const canSubmit =
    password.length > 0 &&
    confirm.length > 0 &&
    password === confirm &&
    !loading;

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      router.replace(ROUTES.LOGIN);
    }
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));

    if (confirm) {
      setConfirmError(validateConfirmPassword(value, confirm));
    }
  };

  const onConfirmChange = (value: string) => {
    setConfirm(value);
    setConfirmError(validateConfirmPassword(password, value));
  };

  // Don't render the form until tokens are validated
  // This prevents a flash of the reset screen on app reload
  if (!ready) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["top"]}
      />
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              layout.screenContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View>
              <OnboardingHeader showBack={false} showProgress={false} />

              <View style={layout.content}>
                <AppText
                  weight="bold"
                  style={[layout.title, { color: colors.text }]}
                >
                  Crear nueva contraseña
                </AppText>

                <AppText style={[layout.subtitle, { color: colors.text }]}>
                  Ingresá y confirmá tu nueva contraseña para continuar.
                </AppText>
              </View>

              <UnderlineInput
                placeholder="Contraseña"
                value={password}
                onChangeText={onPasswordChange}
                fieldType="password"
                secureTextEntry
              />

              {passwordError && (
                <AppText
                  style={[layout.errorText, { color: colors.danger }]}
                  weight="extrabold"
                >
                  {passwordError}
                </AppText>
              )}

              <UnderlineInput
                placeholder="Confirmar contraseña"
                value={confirm}
                onChangeText={onConfirmChange}
                fieldType="confirmPassword"
                secureTextEntry
              />
              {confirmError && (
                <AppText
                  style={[layout.errorText, { color: colors.danger }]}
                  weight="extrabold"
                >
                  {confirmError}
                </AppText>
              )}
            </View>

            <ContinueButton
              text={loading ? "Actualizando..." : "Actualizar contraseña"}
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={layout.bottomButtonContainer}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
