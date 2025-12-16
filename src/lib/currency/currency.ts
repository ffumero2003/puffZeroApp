// src/lib/currency/currency.ts

export type LatamCurrency = {
  code: string;
  label: string;
};

export const LATAM_CURRENCIES: LatamCurrency[] = [
  { code: "USD_SV", label: "El Salvador (USD)" },
  { code: "USD_PA", label: "Panamá (USD)" },
  { code: "CRC", label: "Costa Rica (Colones)" },
  { code: "MXN", label: "México (Pesos Mexicanos)" },
  { code: "COP", label: "Colombia (Pesos Colombianos)" },
  { code: "PEN", label: "Perú (Sol Peruano)" },
  { code: "CLP", label: "Chile (Peso Chileno)" },
  { code: "ARS", label: "Argentina (Peso Argentino)" },
  { code: "GTQ", label: "Guatemala (Quetzal)" },
  { code: "HNL", label: "Honduras (Lempira)" },
  { code: "NIO", label: "Nicaragua (Córdoba)" },
  { code: "PYG", label: "Paraguay (Guaraní)" },
  { code: "UYU", label: "Uruguay (Peso Uruguayo)" },
  { code: "VES", label: "Venezuela (Bolívar)" },
];

export const MIN_BY_CURRENCY: Record<string, number> = {
  CRC: 10000,
  USD_SV: 20,
  USD_PA: 20,
  MXN: 300,
  COP: 25000,
  PEN: 20,
  CLP: 7000,
  ARS: 10000,
  GTQ: 50,
  HNL: 200,
  NIO: 400,
  PYG: 40000,
  UYU: 300,
  VES: 250,
};

export function formatCurrency(value: string | number, currency: string): string {
  const num = Number(value);
  if (!num || isNaN(num)) return "";

  const iso = currency.startsWith("USD") ? "USD" : currency;

  return new Intl.NumberFormat("es-LA", {
    style: "currency",
    currency: iso,
  }).format(num);
}
