// src/components/home/ProgressCircle.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
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
  const size = 280;
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
          stroke={Colors.light.secondary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.light.primary}
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
        <AppText style={styles.percentageLabel}>
          Le has dado al {percentage}% de tu límite
        </AppText>
        
        <AppText weight="bold" style={styles.puffsCount}>
          {currentPuffs}/{totalPuffs} Puffs
        </AppText>
        
        <AppText style={styles.lastTime}>
          Última vez: {lastPuffTime}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  percentageLabel: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.light.text,
    marginBottom: 12,
  },
  puffsCount: {
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 8,
  },
  lastTime: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    opacity: 0.7,
  },
});