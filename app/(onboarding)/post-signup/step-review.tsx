import AppText from "@/src/components/AppText";
import ContinueButton from "@/src/components/onboarding/ContinueButton";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import ReviewCard from "@/src/components/onboarding/ReviewCard";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";
import { Image, ScrollView, View } from "react-native";

import ReviewsModal from "@/assets/images/onboarding/reviews-modal.png";
import AlexReview from "@/assets/images/reviews/alex-review.jpg";
import AntonioReview from "@/assets/images/reviews/antonio-review.jpg";
import MariaReview from "@/assets/images/reviews/maria-review.jpg";
import ScreenWrapper from "@/src/components/system/ScreenWrapper";


export default function Review() {
  return (
    <ScreenWrapper>
      <View style={layout.containerWithLoadingBar}>

        {/* 🔵 HEADER FIJO ARRIBA (sin back ni progress) */}
        <OnboardingHeader
          step={0}
          total={11}
          showBack={false}
          showProgress={false}
        />

        {/* 🔵 BLOQUE SUPERIOR — NO SCROLL */}
        <View style={layout.content}>
          <AppText weight="bold" style={layout.titleCenterNoMargin}>
            Dejanos una calificación
          </AppText>

          <Image
            source={ReviewsModal}
            style={layout.headerImage}
            resizeMode="contain"
          />

          <AppText weight="bold" style={layout.description}>
            Puff
            <AppText weight="extrabold" style={{ color: Colors.light.primary }}>
              Zero
            </AppText>{" "}
            fue diseñado para apoyarte{"\n"}en tu camino
          </AppText>
        </View>

        {/* 🟣 REVIEWS CON SCROLL */}
        <ScrollView
          
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
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

        {/* 🟢 BOTÓN ABAJO FIJO */}
        <ContinueButton
          text="Continuar"
          route="/(onboarding)/post-signup/step-notifications"
          
        />
      </View>
    </ScreenWrapper>
  );

}


