// src/components/onboarding/LoginText.tsx
import AppText from "@/src/components/AppText";
import { ROUTES } from "@/src/constants/routes";
import { useThemeColors } from "@/src/providers/theme-provider";
import { components } from "@/src/styles/components";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
export default function LoginText() {
  const colors = useThemeColors();
  return (
    <AppText style={[components.footer, { color: colors.text }]}>
      ¿Ya tienes cuenta?{" "}
      <AppText
        weight="extrabold"
        style={[components.link, { color: colors.primary }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(ROUTES.LOGIN);
        }}
      >
        Ingresar
      </AppText>
    </AppText>
  );
}
