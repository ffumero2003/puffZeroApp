
import { ScrollView, StyleSheet, View } from "react-native";
import AppText from "../src/components/appText";
import OnboardingHeader from "../src/components/onboarding/onboardingHeader";
import { Colors } from "../src/constants/theme";

export default function TermsOfUse() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />

      <ScrollView showsVerticalScrollIndicator={false}>

        <AppText style={styles.paragraph}>
          Última actualización: Enero 2025
        </AppText>

        <AppText style={styles.sectionTitle}>1. Aceptación de los términos</AppText>
        <AppText style={styles.paragraph}>
          Al usar PuffZero, aceptás estos Términos de Uso. Si no estás de acuerdo con ellos, 
          debés dejar de utilizar la aplicación.
        </AppText>

        <AppText style={styles.sectionTitle}>2. Naturaleza del servicio</AppText>
        <AppText style={styles.paragraph}>
          PuffZero es una herramienta de apoyo diseñada para ayudarte en el proceso de dejar 
          el vapeo y la nicotina. No es un servicio médico ni un sustituto de asesoría profesional.
        </AppText>

        <AppText style={styles.sectionTitle}>3. Registro y seguridad</AppText>
        <AppText style={styles.paragraph}>
          Es tu responsabilidad mantener la confidencialidad de tus credenciales. Podremos 
          suspender cuentas que presenten actividad sospechosa o violen estas condiciones.
        </AppText>

        <AppText style={styles.sectionTitle}>4. Uso permitido</AppText>
        <AppText style={styles.paragraph}>
          Te comprometés a utilizar la app de manera legal, respetuosa y conforme a estos 
          términos. No está permitido manipular, modificar, copiar o distribuir el contenido 
          sin autorización.
        </AppText>

        <AppText style={styles.sectionTitle}>5. Contenido del usuario</AppText>
        <AppText style={styles.paragraph}>
          Cualquier información proporcionada debe ser precisa y respetuosa. Nos reservamos 
          el derecho de eliminar contenido inapropiado o que viole estos términos.
        </AppText>

        <AppText style={styles.sectionTitle}>6. Suscripciones y pagos</AppText>
        <AppText style={styles.paragraph}>
          Algunos servicios pueden requerir suscripciones. Los detalles de precio, renovación 
          y cancelación serán mostrados claramente en la app antes de suscribirte.
        </AppText>

        <AppText style={styles.sectionTitle}>7. Limitación de responsabilidad</AppText>
        <AppText style={styles.paragraph}>
          PuffZero no garantiza resultados específicos. La app es una herramienta de apoyo 
          y su uso es voluntario. No somos responsables por decisiones personales o efectos 
          derivados del uso de la aplicación.
        </AppText>

        <AppText style={styles.sectionTitle}>8. Modificaciones</AppText>
        <AppText style={styles.paragraph}>
          Podemos actualizar estos términos en cualquier momento. Te notificaremos cambios 
          importantes dentro de la aplicación.
        </AppText>

        <AppText style={styles.sectionTitle}>9. Cancelación de cuenta</AppText>
        <AppText style={styles.paragraph}>
          Podés eliminar tu cuenta en cualquier momento. Una vez eliminada, tus datos serán 
          borrados de forma permanente según nuestra Política de Privacidad.
        </AppText>

        <AppText style={styles.sectionTitle}>10. Contacto</AppText>
        <AppText style={styles.paragraph}>
          Para consultas relacionadas con estos Términos de Uso, podés escribirnos a:  
          soporte@puffzero.app
        </AppText>

        <View style={{ height: 70 }} />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    color: Colors.light.text,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 15,
    color: Colors.light.textMuted,
    lineHeight: 22,
  },
});
