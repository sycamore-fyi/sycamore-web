export function mean(arr: number[]): number {
  return arr.reduce((sum, e) => sum + e, 0) / arr.length;
}
