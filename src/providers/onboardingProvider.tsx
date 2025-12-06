import { createContext, useContext, useState } from "react";

interface OnboardingData {
  puffs_per_day: number | null;
  money_per_month: number | null;
  currency: string | null;
  goal: string | null;
  goal_speed: string | null;
  why_stopped: string[];
  worries: string[];

  setPuffs: (n: number) => void;
  setMoney: (n: number) => void;
  setCurrency: (c: string) => void;
  setGoal: (g: string) => void;
  setGoalSpeed: (g: string) => void;
  setWhyStopped: (arr: string[]) => void;
  setWorries: (arr: string[]) => void;

  resetAll: () => void;
}

const OnboardingContext = createContext<OnboardingData | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [puffs_per_day, setPuffs_per_day] = useState<number | null>(null);
  const [money_per_month, setMoney_per_month] = useState<number | null>(null);
  const [currency, setCurrencyState] = useState<string | null>(null);
  const [goal, setGoalState] = useState<string | null>(null);
  const [goal_speed, setGoalSpeedState] = useState<string | null>(null);
  const [why_stopped, setWhyStoppedState] = useState<string[]>([]);
  const [worries, setWorriesState] = useState<string[]>([]);

  function resetAll() {
    setPuffs_per_day(null);
    setMoney_per_month(null);
    setCurrencyState(null);
    setGoalState(null);
    setGoalSpeedState(null);
    setWhyStoppedState([]);
    setWorriesState([]);
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

        setPuffs: setPuffs_per_day,
        setMoney: setMoney_per_month,
        setCurrency: setCurrencyState,
        setGoal: setGoalState,
        setGoalSpeed: setGoalSpeedState,
        setWhyStopped: setWhyStoppedState,
        setWorries: setWorriesState,

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
