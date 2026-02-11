// app/privacy-policy.tsx
import AppText from "@/src/components/AppText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { useThemeColors } from "@/src/providers/theme-provider";
import { layout } from "@/src/styles/layout";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
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

          <AppText style={layout.sectionTitle}>1. Introducción</AppText>
          <AppText style={layout.paragraph}>
            En PuffZero, tu privacidad es una prioridad. Esta Política de
            Privacidad describe cómo recopilamos, utilizamos, protegemos y
            compartimos tu información al utilizar nuestra aplicación diseñada
            para ayudarte a dejar el consumo de vapeo y nicotina.
          </AppText>
          <AppText style={layout.paragraph}>
            PuffZero no está dirigida a menores de 18 años. No recopilamos
            intencionalmente datos de menores. Si descubrimos que un menor nos
            ha proporcionado datos personales, los eliminaremos de inmediato.
          </AppText>

          <AppText style={layout.sectionTitle}>
            2. Información que recopilamos
          </AppText>

          <AppText style={layout.subsectionTitle}>
            2.1 Información que proporcionás
          </AppText>
          <AppText style={layout.paragraph}>
            • Correo electrónico{"\n"}
            • Contraseña en formato cifrado{"\n"}
            • Nombre de usuario{"\n"}
            • Preferencias dentro de la app{"\n"}
            • Datos voluntarios sobre hábitos (p. ej., puffs diarios,
            preocupaciones, objetivos)
          </AppText>

          <AppText style={layout.subsectionTitle}>
            2.2 Información recopilada automáticamente
          </AppText>
          <AppText style={layout.paragraph}>
            • Identificador del dispositivo{"\n"}
            • Versión del sistema operativo{"\n"}
            • Token de notificaciones push (Expo Push Token){"\n"}
            • Estadísticas de uso dentro de la app{"\n"}
            • Información técnica necesaria para su funcionamiento
          </AppText>

          <AppText style={layout.sectionTitle}>
            3. Cómo utilizamos tu información
          </AppText>
          <AppText style={layout.paragraph}>
            Utilizamos tus datos para:{"\n"}
            • Personalizar tu experiencia y recomendaciones dentro de la app
            {"\n"}
            • Mostrar tu progreso y estadísticas{"\n"}
            • Enviarte notificaciones push relevantes sobre tu progreso{"\n"}
            • Mejorar la funcionalidad y rendimiento{"\n"}
            • Comunicarnos contigo cuando sea necesario{"\n"}
            • Garantizar un uso seguro del sistema
          </AppText>

          <AppText style={layout.sectionTitle}>
            4. Base legal para el tratamiento
          </AppText>
          <AppText style={layout.paragraph}>
            Procesamos tus datos en base a:{"\n"}
            • Tu consentimiento{"\n"}
            • La necesidad de proveer el servicio{"\n"}
            • Cumplimiento de obligaciones legales
          </AppText>

          <AppText style={layout.sectionTitle}>
            5. Cómo protegemos tu información
          </AppText>
          <AppText style={layout.paragraph}>
            PuffZero utiliza cifrado, controles de acceso y medidas técnicas
            modernas para proteger tu información. Aunque ningún sistema es 100%
            infalible, tomamos medidas razonables para asegurar su integridad.
          </AppText>

          <AppText style={layout.sectionTitle}>
            6. Compartición de datos
          </AppText>
          <AppText style={layout.paragraph}>
            No vendemos tu información. Podemos compartir datos únicamente con
            los siguientes proveedores necesarios para operar la app:{"\n"}
            • Supabase: autenticación, almacenamiento de datos y base de datos
            {"\n"}
            • RevenueCat: gestión de suscripciones y pagos in-app{"\n"}
            • Expo (EAS): envío de notificaciones push{"\n"}
            • Apple / Google: procesamiento de pagos a través de sus tiendas
            {"\n"}
            • Autoridades legales cuando sea requerido por ley
          </AppText>

          <AppText style={layout.sectionTitle}>
            7. Transferencia internacional de datos
          </AppText>
          <AppText style={layout.paragraph}>
            Tus datos pueden ser transferidos y almacenados en servidores
            ubicados fuera de tu país de residencia (incluyendo Estados Unidos),
            donde los proveedores de servicios como Supabase y RevenueCat
            operan sus infraestructuras. Al usar PuffZero, aceptás estas
            transferencias.
          </AppText>

          <AppText style={layout.sectionTitle}>8. Tus derechos</AppText>
          <AppText style={layout.paragraph}>
            Como usuario tenés derecho a:{"\n"}
            • Acceder a tu información{"\n"}
            • Rectificar datos incorrectos{"\n"}
            • Eliminar tu cuenta y datos asociados{"\n"}
            • Revocar tu consentimiento{"\n"}
            • Solicitar copia de tu información{"\n"}
            • Solicitar la portabilidad de tus datos
          </AppText>

          <AppText style={layout.sectionTitle}>
            9. Conservación de los datos
          </AppText>
          <AppText style={layout.paragraph}>
            Conservamos tus datos mientras tengas una cuenta activa. Al solicitar
            la eliminación de tu cuenta, tus datos personales serán eliminados de
            nuestros sistemas dentro de los 30 días siguientes, salvo que la ley
            exija su conservación por un período mayor.
          </AppText>

          <AppText style={layout.sectionTitle}>
            10. Almacenamiento local
          </AppText>
          <AppText style={layout.paragraph}>
            PuffZero almacena datos localmente en tu dispositivo para mantener tu
            sesión activa y preferencias. Estos datos permanecen en tu
            dispositivo y se eliminan al desinstalar la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>
            11. Cambios a esta política
          </AppText>
          <AppText style={layout.paragraph}>
            Podemos actualizar esta Política de Privacidad para reflejar
            mejoras, cambios legales o ajustes de funcionamiento. Notificaremos
            cambios importantes dentro de la aplicación.
          </AppText>

          <AppText style={layout.sectionTitle}>12. Contacto</AppText>
          <AppText style={layout.paragraph}>
            Si querés ejercer tus derechos de acceso, rectificación, eliminación
            o portabilidad de datos, escribinos a: soporte@puffzero.app.
            Responderemos tu solicitud dentro de los 30 días hábiles.
          </AppText>

          <View style={{ height: 70 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
