// src/components/app/progress/MoneySavedCard.tsx
import AppText from "@/src/components/AppText";
import { Colors } from "@/src/constants/theme";
import { StyleSheet, View } from "react-native";

interface MoneySavedCardProps {
  moneySaved: number;
  currencySymbol: string;
  currency: string;
}

export default function MoneySavedCard({ moneySaved, currencySymbol, currency }: MoneySavedCardProps) {
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
    <View style={styles.container}>
      <AppText weight="bold" style={styles.title}>
        Dinero Ahorrado 💰
      </AppText>
      
      <View style={styles.amountContainer}>
        <AppText weight="semibold" style={styles.amount}>
          {formattedAmount} {getCurrencyName(currency)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  amountContainer: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  amount: {
    fontSize: 14,
    color: Colors.light.textWhite,
    textAlign: "center",
  },
});
