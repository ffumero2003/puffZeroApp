// src/components/onboarding/LoginText.tsx
import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { components } from "@/src/styles/components";
import { router } from "expo-router";

export default function LoginText() {
  return (
    <AppText style={components.footer}>
      ¿Ya tienes cuenta?{" "}
      <AppText
        weight="extrabold"
        style={components.link}
        onPress={() => router.push(ROUTES.LOGIN)}
      >
        Ingresar
      </AppText>
    </AppText>
  );
}