import { Result } from "../types/types";

export function calculateAverage(results: Result[]): number {
  const sorted = results.sort((a, b) => a.time - b.time);

  const middle = sorted.slice(1, results.length - 1); // this gets rid of the best and worst results respectively

  return mean(middle); // means the three middle results
}

export function mean(results: Result[]): number {
  return sum(results) / results.length;
}

export function sum(results: Result[]): number {
  return results.reduce((acc, curr) => acc + curr.time, 0);
}
