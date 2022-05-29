import { createMemo, createSignal } from "solid-js";
import type {
  AddResultResponse,
  Result,
  Saved,
  AlmostSaved
} from "../../types";
import API from "../api-client/index";
import { auth } from "../functions/auth";
import { setAndGenerateScramble, getScramble } from "./scramble";
import { roundToMilliseconds } from "../functions/time";
import { addNotification } from "./notifications";
import { config } from "./config";
import { currentSession } from "./session";

export const [getResults, setResults] = createSignal<
  (Saved<Result> | Result)[]
>([]);

// for some reason, not using the spread operator mutates the signal
export const getResultsAscending = createMemo(() =>
  [...getResults()].sort((a, b) => a.timestamp - b.timestamp)
);

export const getResultsDescending = createMemo(() =>
  [...getResults()].sort((a, b) => b.timestamp - a.timestamp)
);

export function getLastResult(): Result | Saved<Result> | undefined {
  return getResultsAscending().at(-1);
}

export async function addResult(time: number): Promise<void> {
  const roundedTime = roundToMilliseconds(time);

  const unsavedResult: Result = {
    time: roundedTime,
    timestamp: Date.now(),
    scramble: getScramble(),
    session: currentSession.name,
    enteredBy: config.timerType
  };

  const userID = auth.currentUser?.uid;

  if (auth.currentUser !== null && userID !== undefined) {
    const almostSavedResult: AlmostSaved<Result> = {
      ...unsavedResult,
      userID
    };

    const response = await API.results.save(almostSavedResult);

    if (response.status !== 200) {
      addNotification({
        type: "error",
        message: `Failed to save result\n${response.message}`
      });

      return;
    }

    const savedResult = response.data as AddResultResponse | undefined;

    if (savedResult === undefined) {
      setAndGenerateScramble();

      return;
    }

    setResults((results) => [
      ...results,
      { ...almostSavedResult, _id: savedResult.insertedID }
    ]);

    console.log("Saved result to database");
  } else {
    setResults((results) => [...results, unsavedResult]);
  }
}

export function deleteResult(result: Saved<Result> | Result): void {
  setResults((results) => results.filter((r) => r !== result));

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
  result: Partial<Saved<Result>>
): result is Saved<Result> {
  return (
    result._id !== undefined &&
    result.userID !== null &&
    result.time !== undefined &&
    result.timestamp !== undefined &&
    result.session !== undefined &&
    result.scramble !== undefined
  );
}
