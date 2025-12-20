import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Zuffy() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <AppText weight="bold" style={styles.title}>
            Zuffy 💬
          </AppText>
          <AppText style={styles.subtitle}>
            Tu acompañante en el proceso
          </AppText>
        </View>

        {/* Content */}
        <View style={styles.card}>
          <AppText weight="bold" style={styles.cardTitle}>
            Próximamente
          </AppText>
          <AppText style={styles.cardText}>
            Aquí podrás hablar con Zuffy y recibir apoyo
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    opacity: 0.7,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.light.primary,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    color: Colors.light.text,
  },
});