// src/components/app/progress/StreakCard.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface StreakCardProps {
  lastPuffTime: Date | null;
  profileCreatedAt: Date;
}

type StreakTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function StreakCard({ lastPuffTime, profileCreatedAt }: StreakCardProps) {
  const [streak, setStreak] = useState<StreakTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateStreak = () => {
      const startTime = lastPuffTime || profileCreatedAt;
      const diff = Math.max(0, Date.now() - startTime.getTime());

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      setStreak({ days, hours, minutes, seconds });
    };

    calculateStreak();
    const interval = setInterval(calculateStreak, 1000);

    return () => clearInterval(interval);
  }, [lastPuffTime, profileCreatedAt]);

  const formatStreak = () => {
    if (streak.days > 0) {
      return ` ${streak.days} día${streak.days > 1 ? "s" : ""} sin fumar`;
    }
    if (streak.hours > 0) {
      return ` ${streak.hours}h ${streak.minutes}m sin fumar`;
    }
    return ` ${streak.minutes}m ${streak.seconds}s sin fumar`;
  };

  return (
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Streak 🔥
      </AppText>
      
      <View style={styles.streakContainer}>
        <AppText weight="semibold" style={styles.streakText}>
          {formatStreak()}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.textWhite,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    padding: 16,
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  streakContainer: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    
    
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  streakText: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: "center",
  },
});
