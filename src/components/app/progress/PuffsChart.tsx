// src/components/app/progress/PuffsChart.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
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
  const colors = useThemeColors();
  const ranges: { key: TimeRange; label: string }[] = [
    { key: "7days", label: "7 días" },
    { key: "30days", label: "30 días" },
    { key: "all", label: "Uso Histórico" },
  ];

  const maxLabels = 6;
  const labelStep = Math.max(1, Math.ceil(data.length / maxLabels));
  const labels = data.map((d, i) => (i % labelStep === 0 ? String(d.x) : ""));
  const values = data.map((d) => d.y);

  if (daysSinceStart < 7) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View
          style={[styles.emptyChart, { backgroundColor: colors.secondary }]}
        >
          <AppText style={{ color: colors.text, fontSize: 16 }} weight="bold">
            Vuelve en {7 - daysSinceStart} días para ver tu progreso
          </AppText>
        </View>
      </View>
    );
  }

  // Chart config uses dynamic colors
  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${hexToRgb(colors.primary)}, ${opacity})`,
    labelColor: () => colors.textMuted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "4,4",
      stroke: colors.border,
    },
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.secondary },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[styles.rangeSelector, { backgroundColor: colors.secondary }]}
        >
          {ranges.map((range) => (
            <TouchableOpacity
              key={range.key}
              style={[
                styles.rangeButton,
                selectedRange === range.key && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => onRangeChange(range.key)}
            >
              <AppText
                weight={selectedRange === range.key ? "bold" : "regular"}
                style={{
                  fontSize: 12,
                  color:
                    selectedRange === range.key
                      ? colors.textWhite
                      : colors.text,
                }}
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
                color: (opacity = 1) =>
                  `rgba(${hexToRgb(colors.primary)}, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: Array(Math.max(values.length, 1)).fill(dailyGoal),
                color: () => colors.danger,
                strokeWidth: 2,
                withDots: false,
              },
            ],
          }}
          width={screenWidth - 50}
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
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary }]}
          />
          <AppText style={{ fontSize: 11, color: colors.textMuted }}>
            Consumo real
          </AppText>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendLine, { backgroundColor: colors.danger }]}
          />
          <AppText style={{ fontSize: 11, color: colors.textMuted }}>
            Meta diaria ({dailyGoal})
          </AppText>
        </View>
      </View>
    </View>
  );
}

// Helper: converts "#5974FF" → "89, 116, 255" for rgba() strings
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
    result[3],
    16
  )}`;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    borderWidth: 2,
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
    flex: 1,
  },
  rangeSelector: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 2,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
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
    borderRadius: 12,
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
});
