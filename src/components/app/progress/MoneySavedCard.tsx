// src/components/app/progress/MoneySavedCard.tsx
import AppText from "@/src/components/AppText";
import { useThemeColors } from "@/src/providers/theme-provider";
import { StyleSheet, View } from "react-native";
interface MoneySavedCardProps {
  moneySaved: number;
  currencySymbol: string;
  currency: string;
}

export default function MoneySavedCard({
  moneySaved,
  currency,
}: MoneySavedCardProps) {
  const colors = useThemeColors();
  const formattedAmount = moneySaved.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Get currency name for display
  const getCurrencyName = (curr: string) => {
    const names: Record<string, string> = {
      CRC: "colones",
      USD: "dólares",
      EUR: "euros",
      MXN: "pesos",
    };
    return names[curr] || curr;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <AppText weight="bold" style={[styles.title, { color: colors.text }]}>
        Ahorro 💰
      </AppText>

      <View
        style={[
          styles.amountContainer,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <AppText
          weight="semibold"
          style={[styles.amount, { color: colors.text }]}
        >
          {formattedAmount} {getCurrencyName(currency)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  amountContainer: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  amount: {
    fontSize: 14,
    textAlign: "center",
  },
});
