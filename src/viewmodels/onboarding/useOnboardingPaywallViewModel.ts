export function useOnboardingPaywallViewModel() {

    function formatMoney(amount: number, currencyCode: string): string {
      const iso = currencyCode.startsWith("USD") ? "USD" : currencyCode;
      
      try {
        return new Intl.NumberFormat("es-LA", {
          style: "currency",
          currency: iso,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      } catch {
        return `${amount.toLocaleString()} ${iso}`;
      }
    }

    return {
        formatMoney,
    }
}
