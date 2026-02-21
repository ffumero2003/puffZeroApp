import ReviewsModalDark from "@/assets/images/onboarding/dark/reviews-modal-dark.png";
import ReviewsModalLight from "@/assets/images/onboarding/light/reviews-modal-light.png";
import AlexReview from "@/assets/images/reviews/alex-review.jpg";
import AntonioReview from "@/assets/images/reviews/antonio-review.jpg";
import MariaReview from "@/assets/images/reviews/maria-review.jpg";
import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import ReviewCard from "@/src/components/onboarding/ReviewCard";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";
import { useAuth } from "@/src/providers/auth-provider";
import { useTheme } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { useEffect, useRef } from "react";
import { Alert, Dimensions, Image, ScrollView, View } from "react-native";

export default function Review() {
  const { colors, activeTheme } = useTheme();
  const { authFlow } = useAuth();
  const hasShownAlert = useRef(false);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (authFlow === "register" && !hasShownAlert.current) {
      hasShownAlert.current = true;
      Alert.alert("¡Cuenta creada!", "Tu cuenta fue creada exitosamente.", [
        { text: "OK" },
      ]);
    }
  }, [authFlow]);

  const reviewsModal =
    activeTheme === "light" ? ReviewsModalLight : ReviewsModalDark;

  return (
    <ScreenWrapper>
      <View
        style={[
          layout.containerWithLoadingBar,
          { backgroundColor: colors.background },
        ]}
      >
        {/* 🔵 HEADER FIJO ARRIBA (sin back ni progress) */}
        <OnboardingHeader
          step={0}
          total={11}
          showBack={false}
          showProgress={false}
        />

        {/* 🔵 BLOQUE SUPERIOR — NO SCROLL */}
        <View style={layout.content}>
          <AppText
            weight="bold"
            style={[layout.titleCenter, { color: colors.text }]}
          >
            Ellos lo lograron
          </AppText>

          <Image
            source={reviewsModal}
            style={{
              width: screenWidth * 0.85,
              height: screenWidth * 0.85 * 0.55,
              alignSelf: "center",
            }}
            resizeMode="contain"
          />

          <AppText
            weight="bold"
            style={[layout.description, { color: colors.text }]}
          >
            Puff
            <AppText weight="extrabold" style={{ color: colors.primary }}>
              Zero
            </AppText>{" "}
            fue diseñado para apoyarte{"\n"}en tu camino
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ReviewCard
              name="Antonio"
              age={26}
              text="Después de varios intentos fallidos, PuffZero me ayudó a dejar el vape. Mi respiración mejoró muchísimo y ahora hasta volví a jugar con mis hijos sin cansarme. Esta app funcionó cuando nada más lo hacía."
              image={AntonioReview}
            />

            <ReviewCard
              name="María"
              age={24}
              text="Pensé que nunca iba a poder dejar el vape. Cada vez que me estresaba, lo usaba sin pensarlo. PuffZero me ayudó a entender mis hábitos y a mantenerme firme. Hoy respiro mejor, duermo mejor y me siento más segura de mí misma."
              image={MariaReview}
            />

            <ReviewCard
              name="Alex"
              age={31}
              text="Ver cuánto dinero estaba gastando fue un cambio total. PuffZero me abrió los ojos y me ayudó a mantenerme firme."
              image={AlexReview}
            />
          </ScrollView>
        </View>

        {/* 🟢 BOTÓN ABAJO FIJO */}
        <ContinueButton
          text="Continuar"
          route="/(onboarding)/post-signup/step-notifications"
        />
      </View>
    </ScreenWrapper>
  );
}
