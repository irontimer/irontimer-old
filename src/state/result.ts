import { createMemo, createSignal } from "solid-js";
import {
  saveResult,
  deleteResult as dbDeleteResult
} from "../functions/client";
import type { Result } from "../types/types";
import { getPuzzle } from "./puzzle";
import { generateScramble, setScramble } from "./scramble";

// TODO setup mongoose

export const [getResults, setResults] = createSignal<Result[]>([]);

export const getResultsReverse = createMemo(() =>
  getResults().sort((a, b) => b.timestamp - a.timestamp)
);

export function addResult(result: Result, userID?: string): void {
  setResults([...getResults(), result]);

  if (userID !== undefined) {
    saveResult(userID, result);

    console.log("Saved result to database");
  }

  setScramble(generateScramble(getPuzzle()));
}

export function deleteResult(result: Result, userID?: string): void {
  setResults(getResults().filter((r) => r !== result));

  if (userID !== undefined && result._id !== undefined) {
    dbDeleteResult(result);

    console.log("Deleted result from database");
  }
}
