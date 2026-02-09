// app/(app)/progress.tsx
import CountdownTimer from "@/src/components/app/progress/CountdownTimer";
import MoneySavedCard from "@/src/components/app/progress/MoneySavedCard";
import ProgressHeader from "@/src/components/app/progress/ProgressHeader";
import PuffsChart from "@/src/components/app/progress/PuffsChart";
import RecentPuffsStats from "@/src/components/app/progress/RecentPuffsStats";
import StreakCard from "@/src/components/app/progress/StreakCard";
import { useThemeColors } from "@/src/providers/theme-provider";
import { useProgressViewModel } from "@/src/viewmodels/app/useProgressViewModel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export default function Progress() {
  const colors = useThemeColors();
  const {
    loading,
    timeSinceLastPuff,
    lastPuffTime,
    countdownToGoal,
    goalSpeedDays,
    puffsLast24Hours,
    puffsLast7Days,
    puffsLast30Days,
    moneySaved,
    currencySymbol,
    currency,
    chartData,
    dailyGoal,
    selectedTimeRange,
    setSelectedTimeRange,
    refreshData,
    daysSinceStart,
    profileCreatedDate,
  } = useProgressViewModel();

  // Refresh data every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ProgressHeader timeSinceLastPuff={timeSinceLastPuff} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Countdown Timer to Goal */}
        <CountdownTimer
          goalSpeedDays={goalSpeedDays}
          profileCreatedAt={profileCreatedDate}
        />

        {/* Recent Puffs Statistics */}
        <RecentPuffsStats
          puffsLast24Hours={puffsLast24Hours}
          puffsLast7Days={puffsLast7Days}
          puffsLast30Days={puffsLast30Days}
        />

        {/* Money Saved & Streak Cards */}
        <View style={styles.cardsRow}>
          <MoneySavedCard
            moneySaved={moneySaved}
            currencySymbol={currencySymbol}
            currency={currency}
          />
          <StreakCard
            lastPuffTime={lastPuffTime}
            profileCreatedAt={profileCreatedDate}
          />
        </View>

        {/* Puffs Line Chart */}
        <PuffsChart
          data={chartData}
          dailyGoal={dailyGoal}
          selectedRange={selectedTimeRange}
          onRangeChange={setSelectedTimeRange}
          daysSinceStart={daysSinceStart}
        />

        {/* Bottom padding for scroll */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});
