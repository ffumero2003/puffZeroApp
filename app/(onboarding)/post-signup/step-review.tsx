import { Image, ScrollView, StyleSheet, View } from "react-native";
import AppText from "../../../src/components/app-text";
import ContinueButton from "../../../src/components/onboarding/continue-button";
import ReviewCard from "../../../src/components/onboarding/review-card";
import { Colors } from "../../../src/constants/theme";

import ReviewsModal from "../../../assets/images/onboarding/reviews-modal.png";
import AlexReview from "../../../assets/images/reviews/alex-review.jpg";
import AntonioReview from "../../../assets/images/reviews/antonio-review.jpg";
import MariaReview from "../../../assets/images/reviews/maria-review.jpg";


export default function Review() {
  return (
    <View style={styles.container}>

  {/* NOT SCROLLABLE SECTION */}
  <View>
    <AppText weight="bold" style={styles.title}>
      Dejanos una calificación
    </AppText>

    <Image
      source={ReviewsModal}
      style={styles.headerImage}
      resizeMode="contain"
    />

    <AppText weight="bold" style={styles.subtitle}>
      Puff<AppText weight="extrabold" style={{ color: Colors.light.primary }}>Zero</AppText> fue diseñado para apoyarte{"\n"}en tu camino
    </AppText>
  </View>


  {/* SCROLLABLE REVIEWS SECTION */}
  <ScrollView
    style={{ flex: 1, marginTop: 10 }}
    contentContainerStyle={{ paddingBottom: 40 }}
    showsVerticalScrollIndicator={false}
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


  {/* BUTTON FIXED AT BOTTOM */}
  <ContinueButton 
    text="Continuar"
    route="/(onboarding)/post-signup/step-notifications"
    style={{ paddingBottom: 30 }}
  />


</View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 20,
    marginTop: 40
  },

  title: {
    fontSize: 28,
    textAlign: "center",
    color: Colors.light.text,
    marginBottom: 20,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: Colors.light.text,
  },

  reviewCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D7D7F3",
  },

  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    marginBottom: 10,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  reviewStars: {
    fontSize: 16,
  },

  reviewText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 20,
  },

  headerImage: {
  width: "100%",
  height: 200,   // ajustá según tu imagen real
  marginBottom: 20,
},

});
