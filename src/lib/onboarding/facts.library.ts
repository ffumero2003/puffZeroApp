import MoneyIcon from "@/assets/images/onboarding/facts/facts-bag.png";
import LifeIcon from "@/assets/images/onboarding/facts/facts-graph.png";
import TrackIcon from "@/assets/images/onboarding/facts/facts-heart.png";
import PlanIcon from "@/assets/images/onboarding/facts/facts-pencil.png";
import PuffsIcon from "@/assets/images/onboarding/facts/facts-smoke.png";
import ZuffyCloudIcon from "@/assets/images/onboarding/facts/facts-zuffy.png";
import { CURRENCY_SYMBOLS } from "@/src/constants/currency";

// Dynamic facts based on user's onboarding data
export function getFacts(moneyPerMonth: number | null, currency: string | null) {
  const symbol = currency ? (CURRENCY_SYMBOLS[currency] ?? "$") : "$";

  const yearlySavings = moneyPerMonth ? moneyPerMonth * 12 : null;
  const moneyValue = yearlySavings
    ? `${symbol}${yearlySavings.toLocaleString()}`
    : `${symbol}150+`;

  return [
    {
      key: "money_saved",
      icon: MoneyIcon,
      value: moneyValue,
      label: "ahorrados en consumo de nicotina",
    },
    {
      key: "puffs_avoided",
      icon: PuffsIcon,
      value: "2800",
      label: "puffs que no tomaste",
    },
    {
      key: "life_gained",
      icon: LifeIcon,
      value: "1 año",
      label: "de esperanza de vida recuperado",
    },
  ];
}

export const HOW_TO_FACTS = [
  {
    key: "track",
    icon: TrackIcon,
    text: "Registrá tus puffs",
  },
  {
    key: "plan",
    icon: PlanIcon,
    text: "Seguí tu recomendación personalizada",
  },
  {
    key: "zuffy",
    icon: ZuffyCloudIcon,
    text: "Zuffy te acompaña cuando lo necesitás",
  },
];
