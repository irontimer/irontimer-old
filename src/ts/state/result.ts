import { createMemo, createSignal } from "solid-js";
import type {
  AddResultResponse,
  AlmostSavedResult,
  SavedResult,
  UnsavedResult
} from "../../types";
import API from "../api-client/index";
import { auth } from "../functions/auth";
import {
  generateScramble,
  getScramble,
  getScrambleType,
  setScramble
} from "./scramble";
import { roundToMilliseconds } from "../functions/time";

export const [getResultsTemp, setResults] = createSignal<
  (SavedResult | UnsavedResult)[]
>([]);

// for some reason, not using the spread operator mutates the signal
export const getResults = createMemo(() =>
  [...getResultsTemp()].sort((a, b) => a.timestamp - b.timestamp)
);

export const getResultsReverse = createMemo(() =>
  [...getResultsTemp()].sort((a, b) => b.timestamp - a.timestamp)
);

export function getLastResult(): UnsavedResult | SavedResult | undefined {
  return getResults().at(-1);
}

export async function addResult(time: number): Promise<void> {
  const roundedTime = roundToMilliseconds(time);

  const unsavedResult: UnsavedResult = {
    time: roundedTime,
    timestamp: Date.now(),
    scramble: getScramble(),
    scrambleType: getScrambleType()
  };

  const userID = auth.currentUser?.uid;

  if (auth.currentUser !== null && userID !== undefined) {
    const almostSavedResult: AlmostSavedResult = {
      ...unsavedResult,
      userID
    };

    const response = await API.results.save(almostSavedResult);

    const savedResult = response.data as AddResultResponse | undefined;

    if (savedResult === undefined) {
      console.log(response.status, response.message);

      setScramble(generateScramble(getScrambleType()));

      return;
    }

    setResults([
      ...getResults(),
      { ...almostSavedResult, _id: savedResult.insertedID }
    ]);

    console.log("Saved result to database");
  } else {
    setResults([...getResults(), unsavedResult]);
  }
}

export function deleteResult(result: SavedResult | UnsavedResult): void {
  setResults(getResults().filter((r) => r !== result));

  if (auth.currentUser !== null && isDatabaseResult(result)) {
    API.results.delete(result);

    console.log("Deleted result from database");
  }
}

export function deleteAll(): void {
  if (getResults().length === 0) {
    return;
  }

  setResults([]);

  if (auth.currentUser !== null) {
    API.results.deleteAll();

    console.log("Deleted all results from database");
  }
}

export function isDatabaseResult(
  result: Partial<SavedResult>
): result is SavedResult {
  return (
    result._id !== undefined &&
    result.userID !== null &&
    result.time !== undefined &&
    result.timestamp !== undefined &&
    result.scrambleType !== undefined &&
    result.scramble !== undefined
  );
}
