import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const HAS_SEEN_KEY = "hasSeenOnboarding";

export function useOnboardingViewModel() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    checkIfSeen();
  }, []);

  async function checkIfSeen() {
    const hasSeen = await AsyncStorage.getItem(HAS_SEEN_KEY);
    if (hasSeen === "true") {
      setShowLogin(true);
    }
  }

  async function markAsSeen() {
    await AsyncStorage.setItem(HAS_SEEN_KEY, "true");
  }

  //onboarding
  function goToProgress() {
    router.push("/onboarding-progress");
  }

  //onboarding progress
  function goToZuffy() {
    router.push("/onboarding-zuffy");
  }

  //onboarding zuffy
  function goToMoneySaved() {
    router.push("/onboarding-money-saved");
  }

  //onboarding money saved
  function goToGraph() {
    router.push("/(onboarding)/onboarding-graph")
  }

  //onboarding money saved
  function goToPuffCount() {
    router.push("/(onboarding)/onboarding-puffs")
  }

  //onboarding comparison
  function goToGoal() {
    router.push("/(onboarding)/onboarding-goal")
  }


  return {
    showLogin,
    markAsSeen,
    goToProgress,
    goToZuffy,
    goToMoneySaved,
    goToGraph,
    goToPuffCount,
    goToGoal
  };
}
