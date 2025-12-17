import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { DEBUG } from "../config/debug";

interface OnboardingData {
  name: string | null;             
  puffs_per_day: number | null;
  money_per_month: number | null;
  currency: string | null;
  goal: string | null;
  goal_speed: string | null;
  why_stopped: string[];
  worries: string[];

  profile_created_at: string | null;
  setProfileCreatedAt: (d: string) => Promise<void>;

  onboardingCompleted: boolean;        // 🔥 NUEVO
  loading: boolean;                    // 🔥 NUEVO

  setName: (n: string) => void; 
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

  const [name, setNameState] = useState<string | null>(null);

  const [puffs_per_day, setPuffs_per_day] = useState<number | null>(null);
  const [money_per_month, setMoney_per_month] = useState<number | null>(null);
  const [currency, setCurrencyState] = useState<string | null>(null);
  const [goal, setGoalState] = useState<string | null>(null);
  const [goal_speed, setGoalSpeedState] = useState<string | null>(null);
  const [why_stopped, setWhyStoppedState] = useState<string[]>([]);
  const [worries, setWorriesState] = useState<string[]>([]);
  const [profile_created_at, setProfileCreatedAtState] = useState<string | null>(null);


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
      const loadData = async () => {
        const storedCompleted = await AsyncStorage.getItem("onboardingCompleted");
        const storedCreatedAt = await AsyncStorage.getItem("profile_created_at");
        const storedName = await AsyncStorage.getItem("onboarding_name");

        let completed = storedCompleted === "true";

        if (DEBUG.simulateUserState === "NEW") completed = false;
        if (DEBUG.simulateUserState === "LOGGED") completed = true;

        if (storedCreatedAt) {
          setProfileCreatedAtState(storedCreatedAt);
        }
        
        if (storedName) setNameState(storedName);


        setOnboardingCompleted(completed);
        setLoading(false);
      };

      loadData();
    }, []);


    async function setProfileCreatedAt(d: string) {
      setProfileCreatedAtState(d);
      await AsyncStorage.setItem("profile_created_at", d);
    }


      function setName(n: string) {
        setNameState(n);
        AsyncStorage.setItem("onboarding_name", n);
      }



    // 🔥 Marcar onboarding como terminado
    async function completeOnboarding() {
      setOnboardingCompleted(true);
      await AsyncStorage.setItem("onboardingCompleted", "true");

      // 🔥 limpiar datos temporales
      await AsyncStorage.removeItem("onboarding_name");
    }


    // 🔥 Reset (si el usuario quiere empezar onboarding de nuevo)
    function resetAll() {
      setNameState(null);
      setPuffs_per_day(null);
      setMoney_per_month(null);
      setCurrencyState(null);
      setGoalState(null);
      setGoalSpeedState(null);
      setWhyStoppedState([]);
      setWorriesState([]);
      setProfileCreatedAtState(null)
      setOnboardingCompleted(false);
      AsyncStorage.multiRemove([
        "onboardingCompleted",
        "profile_created_at",
      ]);

    }

  return (
    <OnboardingContext.Provider
      value={{
        name,
        setName,
        puffs_per_day,
        money_per_month,
        currency,
        goal,
        goal_speed,
        why_stopped,
        worries,

        profile_created_at,
        setProfileCreatedAt,

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
