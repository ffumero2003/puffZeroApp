import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import UnderlineInput from "@/src/components/onboarding/UnderlineInput";
import { layout } from "@/src/styles/layout";
import { useForgotPasswordViewModel } from "@/src/viewmodels/auth/useForgotPasswordViewModel";

export default function ForgotPassword() {
  const {
    email,
    emailError,
    loading,
    onEmailChange,
    submit,
  } = useForgotPasswordViewModel();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={layout.screenContainer}>
          <View>
            <OnboardingHeader showBack showProgress={false} />

            <View style={layout.content}>
              <AppText weight="bold" style={layout.title}>
                ¿Olvidaste tu contraseña?
              </AppText>

              <AppText style={layout.subtitle}>
                Ingresá tu correo y te enviaremos un enlace para restablecerla.
              </AppText>
            </View>

            <UnderlineInput
              placeholder="Correo"
              value={email}
              onChangeText={onEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {emailError ? (
              <AppText style={layout.errorText} weight="extrabold">
                {emailError}
              </AppText>
            ) : null}
          </View>

          <ContinueButton
            text={loading ? "Enviando..." : "Restablecer contraseña"}
            onPress={submit}
            disabled={loading}
            style={layout.bottomButtonContainer}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
