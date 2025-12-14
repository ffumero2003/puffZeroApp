export function formatCurrency(value: string, currency: string) {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return "";

  const iso = currency.startsWith("USD") ? "USD" : currency;

  return new Intl.NumberFormat("es-LA", {
    style: "currency",
    currency: iso,
  }).format(num);
}
