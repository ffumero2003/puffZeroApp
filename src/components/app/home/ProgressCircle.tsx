// src/components/home/ProgressCircle.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  percentage: number;
  currentPuffs: number;
  totalPuffs: number;
  lastPuffTime: string;
};

export default function ProgressCircle({
  percentage,
  currentPuffs,
  totalPuffs,
  lastPuffTime,
}: Props) {
  const colors = useThemeColors();
  const size = 290;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.secondary}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.content}>
        <AppText style={[styles.percentageLabel, { color: colors.text }]}>
          Le has dado al{" "}
          <AppText
            weight="extrabold"
            style={{ color: colors.primary, fontSize: 20 }}
          >
            {percentage}%
          </AppText>{" "}
          de tu límite
        </AppText>

        <AppText
          weight="bold"
          style={[styles.puffsCount, { color: colors.text }]}
        >
          <AppText
            weight="extrabold"
            style={{ color: colors.primary, fontSize: 36 }}
          >
            {currentPuffs}/{totalPuffs}{" "}
          </AppText>
          Puffs
        </AppText>

        <View
          style={[
            styles.lastTimeContainer,
            { backgroundColor: colors.secondary },
          ]}
        >
          <AppText style={[styles.lastTime, { color: colors.textSecondary }]}>
            Última vez:{" "}
            <AppText weight="extrabold" style={{ color: colors.primary }}>
              {lastPuffTime}
            </AppText>
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  svg: {
    transform: [{ rotateZ: "0deg" }],
  },
  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  percentageLabel: {
    fontSize: 14,
    textAlign: "center",

    marginBottom: 12,
  },
  puffsCount: {
    fontSize: 26,

    marginBottom: 8,
  },
  lastTimeContainer: {
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
  },
  lastTime: {
    fontSize: 14,
  },
});
