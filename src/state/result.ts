import { createMemo, createSignal } from "solid-js";
import type { Result, ResultIDLess } from "../types";
import { generateScramble, getScrambleType, setScramble } from "./scramble";
import API from "../api-client/index";

// TODO setup mongoose

export const [getResults, setResults] = createSignal<(Result | ResultIDLess)[]>(
  []
);

export const getResultsReverse = createMemo(() =>
  getResults().sort((a, b) => b.timestamp - a.timestamp)
);

export function addResult(result: ResultIDLess, userID?: string): void {
  setResults([...getResults(), result]);

  if (userID !== undefined) {
    API.results.save(result);

    console.log("Saved result to database");
  }

  setScramble(generateScramble(getScrambleType()));
}

export function deleteResult(
  result: Result | ResultIDLess,
  userID?: string
): void {
  setResults(getResults().filter((r) => r !== result));

  if (userID !== undefined && isDatabaseResult(result)) {
    API.results.delete(result);

    console.log("Deleted result from database");
  }
}

export function isDatabaseResult(result: Partial<Result>): result is Result {
  return (
    result._id !== undefined &&
    result.userID !== undefined &&
    result.time !== undefined &&
    result.timestamp !== undefined &&
    result.scrambleType !== undefined &&
    result.scramble !== undefined
  );
}
