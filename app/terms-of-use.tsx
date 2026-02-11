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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <View style={layout.containerWithLoadingBar}>
        {/* Header */}
        <OnboardingHeader showProgress={false} />

        <ScrollView
          style={layout.contentPolicyTerms}
          showsVerticalScrollIndicator={false}
        >
          <AppText style={layout.paragraph}>
            Última actualización: Febrero 2026
          </AppText>

          <AppText style={layout.sectionTitle}>
            1. Aceptación de los términos
          </AppText>
          <AppText style={layout.paragraph}>
            Al usar PuffZero, aceptás estos Términos de Uso. Si no estás de
            acuerdo con ellos, debés dejar de utilizar la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>2. Requisitos de edad</AppText>
          <AppText style={layout.paragraph}>
            Debés tener al menos 18 años para utilizar PuffZero. Al crear una
            cuenta, confirmás que cumplís con este requisito.
          </AppText>

          <AppText style={layout.sectionTitle}>
            3. Naturaleza del servicio
          </AppText>
          <AppText style={layout.paragraph}>
            PuffZero es una herramienta de apoyo diseñada para ayudarte en el
            proceso de dejar el vapeo y la nicotina. No es un servicio médico ni
            un sustituto de asesoría profesional.
          </AppText>

          <AppText style={layout.sectionTitle}>4. Registro y seguridad</AppText>
          <AppText style={layout.paragraph}>
            Es tu responsabilidad mantener la confidencialidad de tus
            credenciales. Podremos suspender cuentas que presenten actividad
            sospechosa o violen estas condiciones.
          </AppText>

          <AppText style={layout.sectionTitle}>5. Uso permitido</AppText>
          <AppText style={layout.paragraph}>
            Te comprometés a utilizar la app de manera legal, respetuosa y
            conforme a estos términos. No está permitido manipular, modificar,
            copiar o distribuir el contenido sin autorización.
          </AppText>

          <AppText style={layout.sectionTitle}>
            6. Propiedad intelectual
          </AppText>
          <AppText style={layout.paragraph}>
            Todo el contenido de PuffZero (diseño, textos, logotipos, gráficos y
            código) es propiedad de PuffZero y está protegido por leyes de
            propiedad intelectual. No se otorga ninguna licencia sobre este
            contenido salvo el derecho limitado a usar la app conforme a estos
            términos.
          </AppText>

          <AppText style={layout.sectionTitle}>
            7. Contenido del usuario
          </AppText>
          <AppText style={layout.paragraph}>
            Cualquier información proporcionada debe ser precisa y respetuosa.
            Nos reservamos el derecho de eliminar contenido inapropiado o que
            viole estos términos.
          </AppText>

          <AppText style={layout.sectionTitle}>
            8. Suscripciones y pagos
          </AppText>
          <AppText style={layout.paragraph}>
            Los pagos se procesan a través de Apple App Store o Google Play
            Store según corresponda. Las suscripciones se renuevan
            automáticamente salvo que se cancelen al menos 24 horas antes del
            fin del período actual. La cancelación se realiza desde la
            configuración de tu cuenta en la tienda correspondiente. PuffZero
            utiliza RevenueCat como intermediario para gestionar suscripciones.
          </AppText>

          <AppText style={layout.sectionTitle}>
            9. Servicios de terceros
          </AppText>
          <AppText style={layout.paragraph}>
            PuffZero utiliza servicios de terceros para su funcionamiento,
            incluyendo Supabase (autenticación y base de datos), RevenueCat
            (gestión de suscripciones) y Expo (notificaciones push). Estos
            servicios tienen sus propias políticas de privacidad y términos de
            uso.
          </AppText>

          <AppText style={layout.sectionTitle}>
            10. Limitación de responsabilidad
          </AppText>
          <AppText style={layout.paragraph}>
            PuffZero no garantiza resultados específicos. La app se proporciona
            "tal cual" y "según disponibilidad", sin garantías de ningún tipo,
            ya sean expresas o implícitas. No garantizamos que la app estará
            libre de errores o disponible de forma ininterrumpida. La app es una
            herramienta de apoyo y su uso es voluntario. No somos responsables
            por decisiones personales o efectos derivados del uso de la
            aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>11. Modificaciones</AppText>
          <AppText style={layout.paragraph}>
            Podemos actualizar estos términos en cualquier momento. Te
            notificaremos cambios importantes dentro de la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>
            12. Cancelación de cuenta
          </AppText>
          <AppText style={layout.paragraph}>
            Podés eliminar tu cuenta en cualquier momento. Una vez eliminada,
            tus datos serán borrados de forma permanente según nuestra Política
            de Privacidad.
          </AppText>

          <AppText style={layout.sectionTitle}>13. Ley aplicable</AppText>
          <AppText style={layout.paragraph}>
            Estos términos se rigen por las leyes de la República Argentina.
            Cualquier disputa será sometida a los tribunales competentes de la
            Ciudad Autónoma de Buenos Aires.
          </AppText>

          <View style={{ height: 70 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
