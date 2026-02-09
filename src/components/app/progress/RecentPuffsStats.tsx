// src/components/app/progress/RecentPuffsStats.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
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
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <AppText weight="bold" style={[styles.title, { color: colors.text }]}>
        Ultimamente 💨
      </AppText>

      <View style={styles.statsContainer}>
        <StatCard label="Últimas 24 horas" value={puffsLast24Hours} />
        <StatCard label="Últimos 7 días" value={puffsLast7Days} />
        <StatCard label="Últimos 30 días" value={puffsLast30Days} />
      </View>
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <AppText
        weight="semibold"
        style={[styles.cardLabel, { color: colors.text }]}
      >
        {label}
      </AppText>
      <AppText weight="bold" style={[styles.cardValue, { color: colors.text }]}>
        <AppText
          weight="extrabold"
          style={[styles.cardValueNumber, { color: colors.text }]}
        >
          {value}
        </AppText>{" "}
        puffs
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 20,

    marginBottom: 12,
  },
  statsContainer: {
    gap: 10,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 2,
  },

  cardLabel: {
    fontSize: 18,
    paddingHorizontal: 8,
  },

  cardValue: {
    fontSize: 16,
    paddingHorizontal: 8,
  },
  cardValueNumber: {
    fontSize: 20,
  },
});
