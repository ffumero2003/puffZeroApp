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
        Ahorro 💰
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
    backgroundColor: Colors.light.textWhite,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    padding: 16,
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
  },
  amountContainer: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  amount: {
    fontSize: 14,
    color: Colors.light.text,
    textAlign: "center",
  },
});
