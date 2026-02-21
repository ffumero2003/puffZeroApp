// useMoneySpentViewModel.ts
import { MIN_BY_CURRENCY } from "@/src/constants/currency";
import { useOnboarding } from "@/src/providers/onboarding-provider";

export function useMoneySpentViewModel() {
  const { setMoney, setCurrency } = useOnboarding();

  function isValidAmount(amount: number, currency: string) {
    const min = MIN_BY_CURRENCY[currency] ?? 1;
    return amount >= min;
  }

  function submitMoney(amount: number, currency: string) {
  if (!isValidAmount(amount, currency)) return false;
  setMoney(amount);
  setCurrency(currency);
  return true;
}


  

  return {
    isValidAmount,
    submitMoney,
  };
}
