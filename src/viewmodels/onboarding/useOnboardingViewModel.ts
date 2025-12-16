import AsyncStorage from "@react-native-async-storage/async-storage";
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

  return {
    showLogin,
    markAsSeen,
  };
}
