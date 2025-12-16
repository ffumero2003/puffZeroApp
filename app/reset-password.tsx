import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import UnderlineInput from "@/src/components/onboarding/UnderlineInput";
import { layout } from "@/src/styles/layout";
import { useResetPasswordViewModel } from "@/src/viewmodels/auth/useResetPasswordViewModel";
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from "react-native";

import { ROUTES } from "@/src/constants/routes";
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  const {
    password,
    confirm,
    loading,
    setPassword,
    setConfirm,
    submit,
  } = useResetPasswordViewModel();

  const handleSubmit = async () => {
    const ok = await submit();
    if (ok) {
      router.replace(ROUTES.LOGIN);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={layout.screenContainer}>
          <View>
            <OnboardingHeader showBack={false} showProgress={false} />

            <View style={layout.content}>
              <AppText weight="bold" style={layout.title}>
                Crear nueva contraseña
              </AppText>

              <AppText style={layout.subtitle}>
                Ingresá y confirmá tu nueva contraseña para continuar.
              </AppText>
            </View>

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
          </View>

          <ContinueButton
            text={loading ? "Actualizando..." : "Actualizar contraseña"}
            onPress={handleSubmit}
            disabled={loading}
            style={layout.bottomButtonContainer}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
