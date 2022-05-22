import { createSignal } from "solid-js";
import { saveResult } from "../functions/client";
import type { Result } from "../types/types";
import { getPuzzle } from "./puzzle";
import { generateScramble, setScramble } from "./scramble";

// TODO setup mongodb

export const [getResults, setResults] = createSignal<Result[]>([]);

export function getResultsReverse(): Result[] {
  return getResults().sort((a, b) => b.timestamp - a.timestamp);
}

export function addResult(result: Result, userID?: string): void {
  setResults([...getResults(), result]);

  if (userID !== undefined) {
    saveResult(userID, result);

    console.log("Saved result to database");
  }

  setScramble(generateScramble(getPuzzle()));
}
