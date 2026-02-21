import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { StyleSheet, View } from "react-native";

interface Props {
  data: number[];
  /** Texto opcional para el valor inicial (ej: "20 puffs/día") */
  startLabel?: string;
  /** Texto opcional para el valor final (ej: "0") */
  endLabel?: string;
}

export default function PuffsPlanChart({ data, startLabel, endLabel }: Props) {
  // Guard rail
  const colors = useThemeColors();

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data);
  const startValue = data[0];

  return (
    <View style={styles.container}>
      {/* Escala / labels superiores */}
      <View style={styles.scale}>
        {/* START VALUE */}
        <View style={styles.startGroup}>
          <AppText
            style={[styles.startNumber, { color: colors.primary }]}
            weight="bold"
          >
            {startValue}
          </AppText>
          <AppText style={[styles.startUnit, { color: colors.textMuted }]}>
            puffs/día
          </AppText>
        </View>

        <View style={styles.startGroup}>
          <AppText
            style={[styles.startNumber, { color: colors.primary }]}
            weight="bold"
          >
            0
          </AppText>
          <AppText style={[styles.startUnit, { color: colors.textMuted }]}>
            puffs/día
          </AppText>
        </View>
      </View>

      {/* Chart */}
      <View style={[styles.chart, { backgroundColor: colors.secondary }]}>
        {data.map((value, index) => {
          const heightPct = maxValue === 0 ? 0 : (value / maxValue) * 100;

          return (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  { height: `${heightPct}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* Labels inferiores */}
      <View style={styles.labels}>
        <AppText style={[styles.label, { color: colors.textMuted }]}>
          Hoy
        </AppText>

        <AppText style={[styles.label, { color: colors.textMuted }]}>
          Fin
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  scale: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  scaleText: {
    fontSize: 14,
    opacity: 0.8,
  },
  chart: {
    height: 160,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  labels: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
  startGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  startNumber: {
    fontSize: 18,
    fontWeight: "800",
  },
  startUnit: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  endText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
