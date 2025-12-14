export function getAddictionLevel(puffs: number): string {
  if (puffs > 300) return "Super Pesada";
  if (puffs > 175) return "Pesada";
  if (puffs >= 75) return "Normal";
  return "Suave";
}
