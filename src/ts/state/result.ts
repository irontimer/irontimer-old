import { createMemo, createSignal } from "solid-js";
import type { Result, Saved, AlmostSaved } from "../../types";
import API from "../api-client/index";
import {
  setAndGenerateScramble,
  getScramble,
  revertScramble
} from "./scramble";
import { roundToMilliseconds } from "../utils/misc";
import Notifications from "./notifications";
import { config } from "./config";
import { currentSession } from "./session";
import type { Types } from "mongoose";
import { User } from "firebase/auth";

export const [getResults, setResults] = createSignal<
  (Saved<Result> | Result)[]
>([]);

export const [isSavingResult, setIsSavingResult] = createSignal(false);

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

export async function addResult(
  time: number,
  user: User | null,
  isPlusTwo = false
): Promise<void> {
  if (isSavingResult()) {
    Notifications.add({
      type: "error",
      message: "Cannot add result while a result is saving"
    });

    return;
  }

  const roundedTime = roundToMilliseconds(time);

  const unsavedResult: Result = {
    time: roundedTime,
    timestamp: Date.now(),
    scramble: getScramble(),
    session: currentSession.name,
    enteredBy: config.timerType,
    penalty: isPlusTwo ? "+2" : "OK"
  };

  const userID = user?.uid;

  setResults((results) => [...results, unsavedResult]);

  if (user !== null && userID !== undefined) {
    setIsSavingResult(true);

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

      revertScramble();
      deleteResult(unsavedResult, user);
      revertScramble();
      setIsSavingResult(false);

      return;
    }

    const savedResult = response.data;

    if (savedResult === undefined) {
      setAndGenerateScramble();

      return;
    }

    addIDToResult(unsavedResult, savedResult.insertedID, user);

    setIsSavingResult(false);

    console.log("Saved result to database");
  }
}

export async function deleteResult(
  result: Saved<Result> | Result,
  user: User | null
): Promise<void> {
  setResults((results) => results.filter((r) => r !== result));

  if (user !== null && isDatabaseResult(result)) {
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
  user: User | null,
  db = true
): Promise<void> {
  const newResult = { ...result, ...toChange };

  setResults((results) => results.map((r) => (r === result ? newResult : r)));

  if (db && user !== null && isDatabaseResult(newResult)) {
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

export function addIDToResult(
  result: Result,
  id: Types.ObjectId,
  user: User | null
): void {
  updateResult(result, { _id: id }, user, false);
}

export async function deleteAll(user: User | null): Promise<void> {
  if (getResults().length === 0) {
    return;
  }

  setResults([]);

  if (user !== null) {
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
