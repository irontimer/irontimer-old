import { createSignal } from "solid-js";
import type { Result } from "../types/types";

// TODO setup mongodb

const [getResults, setResultsTemp] = createSignal<Result[]>(
  JSON.parse(localStorage.getItem("results") ?? "[]").map((result: Result) => ({
    ...result,
    date: new Date(result.date)
  }))
);

export function setResults(results: Result[]): void {
  localStorage.setItem("results", JSON.stringify(results));

  setResultsTemp(results);
}

export function addResult(result: Result): void {
  setResults([...getResults(), result]);
}

export function clearResults(): void {
  setResults([]);
}

export { getResults };
