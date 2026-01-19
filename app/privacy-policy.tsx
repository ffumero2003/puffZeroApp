// app/privacy-policy.tsx
import AppText from "@/src/components/AppText";
import OnboardingHeader from "@/src/components/onboarding/OnboardingHeader";
import { Colors } from "@/src/constants/theme";
import { layout } from "@/src/styles/layout";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }} edges={["top"]}>
      <View style={layout.containerWithLoadingBar}>
        
        {/* Header */}
        <OnboardingHeader showProgress={false} />

        <ScrollView 
          style={layout.contentPolicyTerms}
          showsVerticalScrollIndicator={false}
        >

          <AppText style={layout.paragraph}>
            Última actualización: Enero 2025
          </AppText>

          <AppText style={layout.sectionTitle}>1. Introducción</AppText>
          <AppText style={layout.paragraph}>
            En PuffZero, tu privacidad es una prioridad. Esta Política de Privacidad describe 
            cómo recopilamos, utilizamos, protegemos y compartimos tu información al utilizar 
            nuestra aplicación diseñada para ayudarte a dejar el consumo de vapeo y nicotina.
          </AppText>

          <AppText style={layout.sectionTitle}>2. Información que recopilamos</AppText>
          
          <AppText style={layout.subsectionTitle}>2.1 Información que proporcionás</AppText>
          <AppText style={layout.paragraph}>
            • Correo electrónico  
            • Contraseña en formato cifrado  
            • Nombre de usuario  
            • Preferencias dentro de la app  
            • Datos voluntarios sobre hábitos (p. ej., puffs diarios, preocupaciones, objetivos)
          </AppText>

          <AppText style={layout.subsectionTitle}>2.2 Información recopilada automáticamente</AppText>
          <AppText style={layout.paragraph}>
            • Identificador del dispositivo  
            • Versión del sistema operativo  
            • Estadísticas de uso dentro de la app  
            • Información técnica necesaria para su funcionamiento
          </AppText>

          <AppText style={layout.sectionTitle}>3. Cómo utilizamos tu información</AppText>
          <AppText style={layout.paragraph}>
            Utilizamos tus datos para:  
            • Personalizar tu experiencia y recomendaciones dentro de la app  
            • Mostrar tu progreso y estadísticas  
            • Mejorar la funcionalidad y rendimiento  
            • Comunicarnos contigo cuando sea necesario  
            • Garantizar un uso seguro del sistema
          </AppText>

          <AppText style={layout.sectionTitle}>4. Base legal para el tratamiento</AppText>
          <AppText style={layout.paragraph}>
            Procesamos tus datos en base a:  
            • Tu consentimiento  
            • La necesidad de proveer el servicio  
            • Cumplimiento de obligaciones legales
          </AppText>

          <AppText style={layout.sectionTitle}>5. Cómo protegemos tu información</AppText>
          <AppText style={layout.paragraph}>
            PuffZero utiliza cifrado, controles de acceso y medidas técnicas modernas para 
            proteger tu información. Aunque ningún sistema es 100% infalible, tomamos medidas 
            razonables para asegurar su integridad.
          </AppText>

          <AppText style={layout.sectionTitle}>6. Compartición de datos</AppText>
          <AppText style={layout.paragraph}>
            No vendemos tu información.  
            Podemos compartir datos únicamente con:  
            • Proveedores necesarios para operar la app (como Supabase para autenticación)  
            • Autoridades legales cuando sea requerido  
            • Servicios analíticos para mejorar la aplicación  
          </AppText>

          <AppText style={layout.sectionTitle}>7. Tus derechos</AppText>
          <AppText style={layout.paragraph}>
            Como usuario tenés derecho a:  
            • Acceder a tu información  
            • Rectificar datos incorrectos  
            • Eliminar tu cuenta y datos asociados  
            • Revocar tu consentimiento  
            • Solicitar copia de tu información  
          </AppText>

          <AppText style={layout.sectionTitle}>8. Conservación de los datos</AppText>
          <AppText style={layout.paragraph}>
            Conservamos tus datos mientras tengas una cuenta activa. Podés solicitar su 
            eliminación en cualquier momento.
          </AppText>

          <AppText style={layout.sectionTitle}>9. Cambios a esta política</AppText>
          <AppText style={layout.paragraph}>
            Podemos actualizar esta Política de Privacidad para reflejar mejoras, 
            cambios legales o ajustes de funcionamiento. Notificaremos cambios importantes.
          </AppText>

          <AppText style={layout.sectionTitle}>10. Contacto</AppText>
          <AppText style={layout.paragraph}>
            Si tenés dudas o querés ejercer tus derechos, podés contactarnos en:  
            soporte@puffzero.app
          </AppText>

          <View style={{ height: 70 }} />

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

