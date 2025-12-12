import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { DEBUG } from "../config/debug";

interface OnboardingData {
  puffs_per_day: number | null;
  money_per_month: number | null;
  currency: string | null;
  goal: string | null;
  goal_speed: string | null;
  why_stopped: string[];
  worries: string[];

  onboardingCompleted: boolean;        // 🔥 NUEVO
  loading: boolean;                    // 🔥 NUEVO

  setPuffs: (n: number) => void;
  setMoney: (n: number) => void;
  setCurrency: (c: string) => void;
  setGoal: (g: string) => void;
  setGoalSpeed: (g: string) => void;
  setWhyStopped: (arr: string[]) => void;
  setWorries: (arr: string[]) => void;

  completeOnboarding: () => Promise<void>; // 🔥 NUEVO
  resetAll: () => void;
}

const OnboardingContext = createContext<OnboardingData | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const [puffs_per_day, setPuffs_per_day] = useState<number | null>(null);
  const [money_per_month, setMoney_per_month] = useState<number | null>(null);
  const [currency, setCurrencyState] = useState<string | null>(null);
  const [goal, setGoalState] = useState<string | null>(null);
  const [goal_speed, setGoalSpeedState] = useState<string | null>(null);
  const [why_stopped, setWhyStoppedState] = useState<string[]>([]);
  const [worries, setWorriesState] = useState<string[]>([]);

  // 🔥 Cargar el estado guardado (persistencia)
  // useEffect(() => {
  //   const loadFlag = async () => {
  //     const flag = await AsyncStorage.getItem("onboardingCompleted");
  //     setOnboardingCompleted(flag === "true");
  //     setLoading(false);
  //   };
  //   loadFlag();
  // }, []);

    useEffect(() => {
      const loadFlag = async () => {
        const stored = await AsyncStorage.getItem("onboardingCompleted");
        let completed = stored === "true";

       
        // 🔥 SIMULACIÓN DE ESTADO (DEBUG CONTROLADO)
        // -------------------------------------
        if (DEBUG.simulateUserState === "NEW") {
          completed = false;
        }

        if (DEBUG.simulateUserState === "LOGGED") {
          completed = true;
        }

        // REAL → usar AsyncStorage real



        setOnboardingCompleted(completed);
        setLoading(false);
      };

      loadFlag();
    }, []);



  // 🔥 Marcar onboarding como terminado
  async function completeOnboarding() {
    setOnboardingCompleted(true);
    await AsyncStorage.setItem("onboardingCompleted", "true");
  }

  // 🔥 Reset (si el usuario quiere empezar onboarding de nuevo)
  function resetAll() {
    setPuffs_per_day(null);
    setMoney_per_month(null);
    setCurrencyState(null);
    setGoalState(null);
    setGoalSpeedState(null);
    setWhyStoppedState([]);
    setWorriesState([]);
    setOnboardingCompleted(false);
    AsyncStorage.removeItem("onboardingCompleted");
  }

  return (
    <OnboardingContext.Provider
      value={{
        puffs_per_day,
        money_per_month,
        currency,
        goal,
        goal_speed,
        why_stopped,
        worries,

        onboardingCompleted,
        loading,

        setPuffs: setPuffs_per_day,
        setMoney: setMoney_per_month,
        setCurrency: setCurrencyState,
        setGoal: setGoalState,
        setGoalSpeed: setGoalSpeedState,
        setWhyStopped: setWhyStoppedState,
        setWorries: setWorriesState,

        completeOnboarding,   // 🔥 para llamar al final del onboarding
        resetAll,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
