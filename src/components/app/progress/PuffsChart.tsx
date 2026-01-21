// src/components/app/progress/PuffsChart.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

type TimeRange = "7days" | "30days" | "all";

type ChartDataPoint = {
  x: string | number;
  y: number;
};

interface PuffsChartProps {
  data: ChartDataPoint[];
  dailyGoal: number;
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  daysSinceStart: number;
}

const screenWidth = Dimensions.get("window").width;

export default function PuffsChart({
  data,
  dailyGoal,
  selectedRange,
  onRangeChange,
  daysSinceStart,
}: PuffsChartProps) {
  const ranges: { key: TimeRange; label: string }[] = [
    { key: "7days", label: "7 días" },
    { key: "30days", label: "30 días" },
    { key: "all", label: "Uso Histórico" },
  ];

  // Limit labels for readability
  const maxLabels = 6;
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));
  
  const labels = data.map((d, i) => 
    i % labelStep === 0 ? String(d.x) : ""
  );
  
  const values = data.map(d => d.y);

  // If no data, show placeholder
  if (daysSinceStart < 7) {
    return (
      <View style={styles.container}>
        {/* Your range selector header here */}
        <View style={styles.emptyChart}>
          <AppText style={styles.emptyText} weight="bold">
            Vuelve en {7 - daysSinceStart} días para ver tu progreso
          </AppText>
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
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: Colors.light.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "4,4",
      stroke: Colors.light.border,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        
        <View style={styles.rangeSelector}>
          {ranges.map(range => (
            <TouchableOpacity
              key={range.key}
              style={[
                styles.rangeButton,
                selectedRange === range.key && styles.rangeButtonActive,
              ]}
              onPress={() => onRangeChange(range.key)}
            >
              <AppText
                weight={selectedRange === range.key ? "bold" : "regular"}
                style={[
                  styles.rangeButtonText,
                  selectedRange === range.key && styles.rangeButtonTextActive,
                ]}
              >
                {range.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: values.length > 0 ? values : [0],
                color: (opacity = 1) => `rgba(89, 116, 255, ${opacity})`,
                strokeWidth: 2,
              },
              // Goal line
              {
                data: Array(Math.max(values.length, 1)).fill(dailyGoal),
                color: () => Colors.light.danger,
                strokeWidth: 2,
                withDots: false,
              },
            ],
          }}
          width={screenWidth - 60}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.light.primary }]} />
          <AppText style={styles.legendText}>Consumo real</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: Colors.light.danger }]} />
          <AppText style={styles.legendText}>Meta diaria ({dailyGoal})</AppText>
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  rangeSelector: {
    flexDirection: "row",
    backgroundColor: Colors.light.secondary,
    borderRadius: 8,
    padding: 2,
    
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rangeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  rangeButtonText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  rangeButtonTextActive: {
    color: Colors.light.textWhite,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    
  },
  emptyText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: Colors.light.textMuted,
  },
});
