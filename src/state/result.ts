import { createMemo, createSignal } from "solid-js";
import type { AddResultResponse, SavedResult, UnsavedResult } from "../types";
import API from "../api-client/index";
import { auth } from "../functions/auth";

export const [getResults, setResults] = createSignal<
  (SavedResult | UnsavedResult)[]
>([]);

export const getResultsReverse = createMemo(() =>
  getResults().sort((a, b) => b.timestamp - a.timestamp)
);

export async function addResult(
  result: UnsavedResult,
  userID?: string
): Promise<void> {
  if (auth.currentUser !== null && userID !== undefined) {
    const response = await API.results.save({
      ...result,
      userID
    });

    const savedResult = response.data as AddResultResponse;

    setResults([
      ...getResults(),
      { ...result, _id: savedResult.insertedID, userID }
    ]);

    console.log("Saved result to database");
  } else {
    setResults([...getResults(), result]);
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
