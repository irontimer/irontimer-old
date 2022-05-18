import { createSignal } from "solid-js";
import type { Result } from "../types/types";
import { getPuzzle } from "./puzzle";
import { generateScramble, setScramble } from "./scramble";

// TODO setup mongodb

const [getResults, setResultsTemp] = createSignal<Result[]>(
  JSON.parse(localStorage.getItem("results") ?? "[]")
);

export function setResults(results: Result[]): void {
  localStorage.setItem("results", JSON.stringify(results));

  setResultsTemp(results);
}

export function addResult(result: Result): void {
  setResults([...getResults(), result]);

  setScramble(generateScramble(getPuzzle()));
}

export function clearResults(): void {
  setResults([]);
}

export { getResults };
