import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { useProgressViewModel } from "@/src/viewmodels/app/usePorgressViewModel";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Progress() {
  const { loading, progressData } = useProgressViewModel();

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
            Tu Progreso 📊
          </AppText>
          <AppText style={styles.subtitle}>
            Visualiza tu evolución día a día
          </AppText>
        </View>

        {/* Content will go here */}
        <View style={styles.card}>
          <AppText weight="bold" style={styles.cardTitle}>
            Próximamente
          </AppText>
          <AppText style={styles.cardText}>
            Aquí verás tus estadísticas y progreso
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