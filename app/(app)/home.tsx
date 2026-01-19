// app/(app)/home.tsx
import AppText from "@/src/components/AppText";
import DayDetailModal from "@/src/components/app/home/DayDetailModal";
import HomeHeader from "@/src/components/app/home/HomeHeader";
import ProgressCircle from "@/src/components/app/home/ProgressCircle";
import WeekDayCircle from "@/src/components/app/home/WeekDayCircle";
// COMMENTED OUT: Invalid direct imports - these are returned by the hook, not exported
// import { currentWeek, canGoBack, canGoForward, goToPreviousWeek, goToNextWeek } from "@/src/viewmodels/app/useHomeViewModel";
import { Colors } from "@/src/constants/theme";
import { useHomeViewModel } from "@/src/viewmodels/app/useHomeViewModel";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function Home() {
  const {
    firstName,
    dailyGoal,
    todayPuffs,
    percentage,
    timeSinceLastPuff,
    motivationalMessage,
    currentWeek,
    // COMMENTED OUT: Week navigation - kept for potential future use
    // canGoBack,
    // canGoForward,
    addPuff,
    // goToPreviousWeek,
    // goToNextWeek,
  } = useHomeViewModel();

  const [selectedDay, setSelectedDay] = useState<any>(null);

  return (
    <>
      <View style={styles.container}>
       
        
          {/* Header */}
          <View style={styles.header}>
            <HomeHeader firstName={firstName} dailyGoal={dailyGoal} />
          </View>

          <View
          style={[styles.scrollView, styles.content]}
          
        >

          {/* Week selector - current week only */}
          {currentWeek && (
            <View style={styles.daysRow}>
              {currentWeek.days.map((day, index) => (
                <WeekDayCircle
                  key={index}
                  day={day.day}
                  puffs={day.puffs}
                  isToday={day.isToday}
                  isActive={day.isToday}
                  onPress={() => setSelectedDay(day)}
                />
              ))}
            </View>
          )}

          {/* Motivational Quote */}
          <View style={styles.quoteContainer}>
          <AppText
            style={[
              styles.quote,
              { transform: [{ skewX: "-10deg" }] },
            ]}
            weight="bold"
          >
            {motivationalMessage}
          </AppText>
        </View>


          {/* Progress Circle */}
          <ProgressCircle
            percentage={percentage}
            currentPuffs={todayPuffs}
            totalPuffs={dailyGoal}
            lastPuffTime={timeSinceLastPuff}
          />

          {/* Add Puff Button */}
          <TouchableOpacity style={styles.addButton} onPress={addPuff} activeOpacity={0.8}>
            <Ionicons name="add" size={60} color={Colors.light.textWhite} />
            <AppText weight="bold" style={styles.addButtonText}>
              Agregar Puffs
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Day Detail Modal */}
        {selectedDay && (
          <DayDetailModal
            visible={!!selectedDay}
            day={selectedDay.day}
            date={new Date(selectedDay.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            puffs={selectedDay.puffs}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 10,
    
  },
  
  // weekContainer: {
  //   marginBottom: 0,
  // },
  // weekHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 16,
  // },
  // weekLabel: {
  //   fontSize: 14,
  //   color: Colors.light.text,
  // },
  // arrowButton: {
  //   padding: 8,
  // },
  // arrowButtonDisabled: {
  //   opacity: 0.3,
  // },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    paddingVertical: 6,
    
  },
  quoteContainer: {
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  quote: {
    fontSize: 22,
    textAlign: "center",
    fontStyle: "italic",
    color: Colors.light.text,
    lineHeight: 26,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: Colors.light.textWhite,
  },
});