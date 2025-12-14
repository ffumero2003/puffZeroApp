export function buildPuffsPlan(
  puffsPerDay: number,
  days: number
): number[] {
  if (days <= 0 || puffsPerDay <= 0) return [];

  return Array.from({ length: days }, (_, i) => {
    const remaining = puffsPerDay * (1 - i / days);
    return Math.max(0, Math.round(remaining));
  });
}

export function sampleChartData(
  data: number[],
  maxBars: number = 14
): number[] {
  if (data.length <= maxBars) return data;

  const step = Math.ceil(data.length / maxBars);
  return data.filter((_, index) => index % step === 0);
}
