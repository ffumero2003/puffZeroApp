// src/components/app/progress/CountdownTimer.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface CountdownTimerProps {
  goalSpeedDays: number;
  profileCreatedAt: Date;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function CountdownTimer({ goalSpeedDays, profileCreatedAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date(profileCreatedAt.getTime() + goalSpeedDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = Math.max(0, endTime.getTime() - now.getTime());

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [goalSpeedDays, profileCreatedAt]);

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Tiempo meta 🔥
      </AppText>
      
      <View style={styles.timerRow}>
        <TimeBox value={timeLeft.days} label="días" />
        <TimeBox value={timeLeft.hours} label="horas" />
        <TimeBox value={timeLeft.minutes} label="minutos" />
        <TimeBox value={timeLeft.seconds} label="segundos" />
      </View>
    </View>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.timeBox}>
      <AppText weight="bold" style={styles.timeValue}>
        {value}
      </AppText>
      <AppText style={styles.timeLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    
  },
  title: {
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: "center",
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  timeBox: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 70,
    alignItems: "center",
  },
  timeValue: {
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 2,
  },
  timeLabel: {
    fontSize: 11,
    color: Colors.light.text,
    opacity: 0.8,
  },
});
