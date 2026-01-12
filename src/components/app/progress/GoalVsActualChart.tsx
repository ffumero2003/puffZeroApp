// src/components/app/progress/GoalVsActualChart.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

type GoalVsActualDataPoint = {
  day: string | number;
  actual: number;
  goal: number;
};

interface GoalVsActualChartProps {
  data: GoalVsActualDataPoint[];
  dailyGoal: number;
}

const screenWidth = Dimensions.get("window").width;

export default function GoalVsActualChart({ data, dailyGoal }: GoalVsActualChartProps) {
  // Limit data to last 7 days for readability in bar chart
  const limitedData = data.slice(-7);

  // Calculate average
  const average = limitedData.length > 0
    ? Math.round(limitedData.reduce((sum, d) => sum + d.actual, 0) / limitedData.length)
    : 0;

  // If no data, show placeholder
  if (limitedData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText weight="semibold" style={styles.title}>
            Meta vs Consumo Real
          </AppText>
          <AppText style={styles.subtitle}>
            Sin datos disponibles
          </AppText>
        </View>

        <View style={styles.emptyChart}>
          <AppText style={styles.emptyText}>Sin datos aún</AppText>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: "#FFF",
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(89, 116, 255, ${opacity})`,
    labelColor: () => Colors.light.textMuted,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.6,
    propsForBackgroundLines: {
      strokeDasharray: "4,4",
      stroke: Colors.light.border,
    },
  };

  const labels = limitedData.map(d => String(d.day));
  const values = limitedData.map(d => d.actual);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="semibold" style={styles.title}>
          Meta vs Consumo Real
        </AppText>
        <AppText style={styles.subtitle}>
          Últimos {limitedData.length} días
        </AppText>
      </View>

      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels: labels,
            datasets: [
              {
                data: values.length > 0 ? values : [0],
              },
            ],
          }}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          withInnerLines={true}
          showBarTops={true}
          fromZero={true}
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>

      {/* Goal reference line indicator */}
      <View style={styles.goalIndicator}>
        <View style={styles.goalLine} />
        <AppText style={styles.goalText}>Meta: {dailyGoal} puffs/día</AppText>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryLabel}>Meta diaria</AppText>
          <AppText weight="bold" style={styles.summaryValue}>{dailyGoal} puffs</AppText>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <AppText style={styles.summaryLabel}>Promedio real</AppText>
          <AppText weight="bold" style={[styles.summaryValue, { color: Colors.light.primary }]}>
            {average} puffs
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textMuted,
    marginTop: 2,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
  },
  emptyText: {
    color: Colors.light.textMuted,
    fontSize: 14,
  },
  goalIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  goalLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.light.danger,
  },
  goalText: {
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  summaryItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.light.border,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.light.textMuted,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
