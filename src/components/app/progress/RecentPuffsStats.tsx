// src/components/app/progress/RecentPuffsStats.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { StyleSheet, View } from "react-native";

interface RecentPuffsStatsProps {
  puffsLast24Hours: number;
  puffsLast7Days: number;
  puffsLast30Days: number;
}

export default function RecentPuffsStats({
  puffsLast24Hours,
  puffsLast7Days,
  puffsLast30Days,
}: RecentPuffsStatsProps) {
  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Ultimamente 💨
      </AppText>

      <View style={styles.statsContainer}>
        <StatCard 
          label="Últimas 24 horas" 
          value={puffsLast24Hours} 
          highlight 
        />
        <StatCard 
          label="Últimos 7 días" 
          value={puffsLast7Days} 
        />
        <StatCard 
          label="Últimos 30 días" 
          value={puffsLast30Days} 
        />
      </View>
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function StatCard({ label, value, highlight }: StatCardProps) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <AppText 
        weight="semibold" 
        style={[styles.cardLabel, highlight && styles.cardLabelHighlight]}
      >
        {label}
      </AppText>
      <AppText weight="bold" style={styles.cardValue}>
        <AppText weight="extrabold" style={styles.cardValueNumber}>
          {value}
        </AppText>
        {" "}puffs
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 12,
  },
  statsContainer: {
    gap: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHighlight: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  cardLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  cardLabelHighlight: {
    color: Colors.light.text,
  },
  cardValue: {
    fontSize: 16,
    color: Colors.light.text,
  },
  cardValueNumber: {
    fontSize: 20,
    color: Colors.light.primary,
  },
});
