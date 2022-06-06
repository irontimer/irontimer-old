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
import Notifications from "./notifications";
import { config } from "./config";
import { currentSession } from "./session";
import { Schema } from "mongoose";

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
    enteredBy: config.timerType,
    penalty: "OK"
  };

  const userID = auth.currentUser?.uid;

  setResults((results) => [...results, unsavedResult]);

  if (auth.currentUser !== null && userID !== undefined) {
    const almostSavedResult: AlmostSaved<Result> = {
      ...unsavedResult,
      userID
    };

    const response = await API.results.save(almostSavedResult);

    if (response.status !== 200) {
      Notifications.add({
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

    addIDToResult(unsavedResult, savedResult.insertedID);

    console.log("Saved result to database");
  }
}

export async function deleteResult(
  result: Saved<Result> | Result
): Promise<void> {
  setResults((results) => results.filter((r) => r !== result));

  if (auth.currentUser !== null && isDatabaseResult(result)) {
    const response = await API.results.delete(result);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to delete result\n${response.message}`
      });

      return;
    }

    console.log("Deleted result from database");
  }
}

export async function updateResult(
  result: Saved<Result> | Result,
  toChange: Partial<Saved<Result>>,
  db = true
): Promise<void> {
  const newResult = { ...result, ...toChange };

  setResults((results) => results.map((r) => (r === result ? newResult : r)));

  if (db && auth.currentUser !== null && isDatabaseResult(newResult)) {
    const response = await API.results.update(newResult);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to update result\n${response.message}`
      });

      return;
    }

    console.log("Updated result in database");
  }
}

export function addIDToResult(result: Result, id: Schema.Types.ObjectId): void {
  updateResult(result, { _id: id }, false);
}

export async function deleteAll(): Promise<void> {
  if (getResults().length === 0) {
    return;
  }

  setResults([]);

  if (auth.currentUser !== null) {
    const response = await API.results.deleteAll();

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to delete all results\n${response.message}`
      });

      return;
    }

    console.log("Deleted all results from database");
  }
}

export function isDatabaseResult(
  result: Partial<Saved<Result>>
): result is Saved<Result> {
  return result._id !== undefined && !!result.userID;
}
