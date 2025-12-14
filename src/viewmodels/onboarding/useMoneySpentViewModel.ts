import { MIN_BY_CURRENCY } from "@/src/constants/currency";
import { useOnboarding } from "@/src/providers/onboarding-provider";
import { router } from "expo-router";

export function useMoneySpentViewModel() {
  const { setMoney, setCurrency } = useOnboarding();

  function isValidAmount(amount: number, currency: string) {
    const min = MIN_BY_CURRENCY[currency] ?? 0;
    return amount >= min;
  }

  function continueWithMoney(amount: number, currency: string) {
    setMoney(amount);
    setCurrency(currency);
    router.push("/onboarding-comparison");
  }

  return {
    isValidAmount,
    continueWithMoney,
  };
}
