export const LATAM_CURRENCIES = [
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

// Add to src/constants/currency.ts

// Base prices in CRC (Costa Rican Colones)
export const BASE_PRICES_CRC = {
  weekly: 5000,
  yearly: 700,
};

// Approximate exchange rates from CRC to other currencies
export const CRC_EXCHANGE_RATES: Record<string, number> = {
  CRC: 1,
  USD_SV: 0.002,    // ~500 CRC = 1 USD
  USD_PA: 0.002,
  MXN: 0.034,       // ~500 CRC = 17 MXN
  COP: 8,           // ~500 CRC = 4000 COP
  PEN: 0.0074,      // ~500 CRC = 3.7 PEN
  CLP: 1.8,         // ~500 CRC = 900 CLP
  ARS: 1.7,         // ~500 CRC = 850 ARS
  GTQ: 0.0154,      // ~500 CRC = 7.7 GTQ
  HNL: 0.049,       // ~500 CRC = 24.5 HNL
  NIO: 0.072,       // ~500 CRC = 36 NIO
  PYG: 14.5,        // ~500 CRC = 7250 PYG
  UYU: 0.078,       // ~500 CRC = 39 UYU
  VES: 0.072,       // ~500 CRC = 36 VES
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CRC: "₡",
  USD_SV: "$",
  USD_PA: "$",
  MXN: "$",
  COP: "$",
  PEN: "S/",
  CLP: "$",
  ARS: "$",
  GTQ: "Q",
  HNL: "L",
  NIO: "C$",
  PYG: "₲",
  UYU: "$",
  VES: "Bs",
};