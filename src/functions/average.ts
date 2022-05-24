import { Result, ResultIDLess } from "../types";

export function calculateAverage(results: (Result | ResultIDLess)[]): number {
  const sorted = results.sort((a, b) => a.time - b.time);

  const middle = sorted.slice(1, results.length - 1); // this gets rid of the best and worst results respectively

  return mean(middle.map((result) => result.time)); // means the three middle results
}

export function mean(arr: number[]): number {
  return sum(arr) / arr.length;
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}
