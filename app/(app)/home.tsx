// app/(app)/home.tsx
import AppText from "@/src/components/AppText";
import DayDetailModal from "@/src/components/app/home/DayDetailModal";
import HomeHeader from "@/src/components/app/home/HomeHeader";
import ProgressCircle from "@/src/components/app/home/ProgressCircle";
import WeekDayCircle from "@/src/components/app/home/WeekDayCircle";
import { Colors } from "@/src/constants/theme";
import { useHomeViewModel } from "@/src/viewmodels/app/useHomeViewModel";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Home() {
  const {
    firstName,
    dailyGoal,
    todayPuffs,
    percentage,
    timeSinceLastPuff,
    motivationalMessage,
    currentWeek,
    canGoBack,
    canGoForward,
    addPuff,
    goToPreviousWeek,
    goToNextWeek,
  } = useHomeViewModel();

  const [selectedDay, setSelectedDay] = useState<any>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <HomeHeader firstName={firstName} dailyGoal={dailyGoal} />
        </View>

        {/* Week selector */}
        {currentWeek && (
          <View style={styles.weekContainer}>
            <View style={styles.weekHeader}>
              <TouchableOpacity
                onPress={goToPreviousWeek}
                disabled={!canGoBack}
                style={[styles.arrowButton, !canGoBack && styles.arrowButtonDisabled]}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={canGoBack ? Colors.light.primary : Colors.light.textSecondary}
                />
              </TouchableOpacity>

              <AppText weight="semibold" style={styles.weekLabel}>
                {currentWeek.weekLabel}
              </AppText>

              <TouchableOpacity
                onPress={goToNextWeek}
                disabled={!canGoForward}
                style={[styles.arrowButton, !canGoForward && styles.arrowButtonDisabled]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={canGoForward ? Colors.light.primary : Colors.light.textSecondary}
                />
              </TouchableOpacity>
            </View>

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
          </View>
        )}

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
          <AppText style={styles.quote}>"{motivationalMessage}"</AppText>
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
      </ScrollView>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  weekContainer: {
    marginBottom: 20,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weekLabel: {
    fontSize: 14,
    color: Colors.light.text,
  },
  arrowButton: {
    padding: 8,
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  quoteContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  quote: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
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