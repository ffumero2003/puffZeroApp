import { ScrollView, StyleSheet, View } from "react-native";
import AppText from "../src/components/appText";
import OnboardingHeader from "../src/components/onboarding/onboardingHeader";
import { Colors } from "../src/constants/theme";

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <OnboardingHeader showProgress={false} style={{ marginBottom: 20 }} />

      <ScrollView showsVerticalScrollIndicator={false}>

        <AppText style={styles.paragraph}>
          Última actualización: Enero 2025
        </AppText>

        <AppText style={styles.sectionTitle}>1. Introducción</AppText>
        <AppText style={styles.paragraph}>
          En PuffZero, tu privacidad es una prioridad. Esta Política de Privacidad describe 
          cómo recopilamos, utilizamos, protegemos y compartimos tu información al utilizar 
          nuestra aplicación diseñada para ayudarte a dejar el consumo de vapeo y nicotina.
        </AppText>

        <AppText style={styles.sectionTitle}>2. Información que recopilamos</AppText>
        
        <AppText style={styles.subsectionTitle}>2.1 Información que proporcionás</AppText>
        <AppText style={styles.paragraph}>
          • Correo electrónico  
          • Contraseña en formato cifrado  
          • Nombre de usuario  
          • Preferencias dentro de la app  
          • Datos voluntarios sobre hábitos (p. ej., puffs diarios, preocupaciones, objetivos)
        </AppText>

        <AppText style={styles.subsectionTitle}>2.2 Información recopilada automáticamente</AppText>
        <AppText style={styles.paragraph}>
          • Identificador del dispositivo  
          • Versión del sistema operativo  
          • Estadísticas de uso dentro de la app  
          • Información técnica necesaria para su funcionamiento
        </AppText>

        <AppText style={styles.sectionTitle}>3. Cómo utilizamos tu información</AppText>
        <AppText style={styles.paragraph}>
          Utilizamos tus datos para:  
          • Personalizar tu experiencia y recomendaciones dentro de la app  
          • Mostrar tu progreso y estadísticas  
          • Mejorar la funcionalidad y rendimiento  
          • Comunicarnos contigo cuando sea necesario  
          • Garantizar un uso seguro del sistema
        </AppText>

        <AppText style={styles.sectionTitle}>4. Base legal para el tratamiento</AppText>
        <AppText style={styles.paragraph}>
          Procesamos tus datos en base a:  
          • Tu consentimiento  
          • La necesidad de proveer el servicio  
          • Cumplimiento de obligaciones legales
        </AppText>

        <AppText style={styles.sectionTitle}>5. Cómo protegemos tu información</AppText>
        <AppText style={styles.paragraph}>
          PuffZero utiliza cifrado, controles de acceso y medidas técnicas modernas para 
          proteger tu información. Aunque ningún sistema es 100% infalible, tomamos medidas 
          razonables para asegurar su integridad.
        </AppText>

        <AppText style={styles.sectionTitle}>6. Compartición de datos</AppText>
        <AppText style={styles.paragraph}>
          No vendemos tu información.  
          Podemos compartir datos únicamente con:  
          • Proveedores necesarios para operar la app (como Supabase para autenticación)  
          • Autoridades legales cuando sea requerido  
          • Servicios analíticos para mejorar la aplicación  
        </AppText>

        <AppText style={styles.sectionTitle}>7. Tus derechos</AppText>
        <AppText style={styles.paragraph}>
          Como usuario tenés derecho a:  
          • Acceder a tu información  
          • Rectificar datos incorrectos  
          • Eliminar tu cuenta y datos asociados  
          • Revocar tu consentimiento  
          • Solicitar copia de tu información  
        </AppText>

        <AppText style={styles.sectionTitle}>8. Conservación de los datos</AppText>
        <AppText style={styles.paragraph}>
          Conservamos tus datos mientras tengas una cuenta activa. Podés solicitar su 
          eliminación en cualquier momento.
        </AppText>

        <AppText style={styles.sectionTitle}>9. Cambios a esta política</AppText>
        <AppText style={styles.paragraph}>
          Podemos actualizar esta Política de Privacidad para reflejar mejoras, 
          cambios legales o ajustes de funcionamiento. Notificaremos cambios importantes.
        </AppText>

        <AppText style={styles.sectionTitle}>10. Contacto</AppText>
        <AppText style={styles.paragraph}>
          Si tenés dudas o querés ejercer tus derechos, podés contactarnos en:  
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
  subsectionTitle: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    color: Colors.light.textMuted,
    lineHeight: 22,
  },
});
