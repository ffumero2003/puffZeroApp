// app/terms-of-use.tsx
import AppText from "@/src/components/AppText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfUse() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={layout.containerWithLoadingBar}>
        
        {/* Header */}
        <OnboardingHeader showProgress={false}  />

        <ScrollView 
          style={layout.contentPolicyTerms}
          showsVerticalScrollIndicator={false}
        >

          <AppText style={layout.paragraph}>
            Última actualización: Enero 2025
          </AppText>

          <AppText style={layout.sectionTitle}>1. Aceptación de los términos</AppText>
          <AppText style={layout.paragraph}>
            Al usar PuffZero, aceptás estos Términos de Uso. Si no estás de acuerdo con ellos, 
            debés dejar de utilizar la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>2. Naturaleza del servicio</AppText>
          <AppText style={layout.paragraph}>
            PuffZero es una herramienta de apoyo diseñada para ayudarte en el proceso de dejar 
            el vapeo y la nicotina. No es un servicio médico ni un sustituto de asesoría profesional.
          </AppText>

          <AppText style={layout.sectionTitle}>3. Registro y seguridad</AppText>
          <AppText style={layout.paragraph}>
            Es tu responsabilidad mantener la confidencialidad de tus credenciales. Podremos 
            suspender cuentas que presenten actividad sospechosa o violen estas condiciones.
          </AppText>

          <AppText style={layout.sectionTitle}>4. Uso permitido</AppText>
          <AppText style={layout.paragraph}>
            Te comprometés a utilizar la app de manera legal, respetuosa y conforme a estos 
            términos. No está permitido manipular, modificar, copiar o distribuir el contenido 
            sin autorización.
          </AppText>

          <AppText style={layout.sectionTitle}>5. Contenido del usuario</AppText>
          <AppText style={layout.paragraph}>
            Cualquier información proporcionada debe ser precisa y respetuosa. Nos reservamos 
            el derecho de eliminar contenido inapropiado o que viole estos términos.
          </AppText>

          <AppText style={layout.sectionTitle}>6. Suscripciones y pagos</AppText>
          <AppText style={layout.paragraph}>
            Algunos servicios pueden requerir suscripciones. Los detalles de precio, renovación 
            y cancelación serán mostrados claramente en la app antes de suscribirte.
          </AppText>

          <AppText style={layout.sectionTitle}>7. Limitación de responsabilidad</AppText>
          <AppText style={layout.paragraph}>
            PuffZero no garantiza resultados específicos. La app es una herramienta de apoyo 
            y su uso es voluntario. No somos responsables por decisiones personales o efectos 
            derivados del uso de la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>8. Modificaciones</AppText>
          <AppText style={layout.paragraph}>
            Podemos actualizar estos términos en cualquier momento. Te notificaremos cambios 
            importantes dentro de la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>9. Cancelación de cuenta</AppText>
          <AppText style={layout.paragraph}>
            Podés eliminar tu cuenta en cualquier momento. Una vez eliminada, tus datos serán 
            borrados de forma permanente según nuestra Política de Privacidad.
          </AppText>

          <AppText style={layout.sectionTitle}>10. Contacto</AppText>
          <AppText style={layout.paragraph}>
            Para consultas relacionadas con estos Términos de Uso, podés escribirnos a:  
            soporte@puffzero.app
          </AppText>

          <View style={{ height: 70 }} />

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

