/** Formats a 0–1 ratio as a percentage with at most one decimal place, e.g. 0.875 → "87.5%". */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 1000) / 10}%`
}
