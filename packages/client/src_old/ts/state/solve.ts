import { User } from "firebase/auth";
import type { Types } from "mongoose";
import { createMemo, createSignal } from "solid-js";
import type { AlmostSaved, Saved, Solve } from "utils";
import API from "../api-client/index";
import { roundToMilliseconds } from "../utils/misc";
import { config } from "./config";
import Notifications from "./notifications";
import {
  getScramble,
  revertScramble,
  setAndGenerateScramble
} from "./scramble";
import { currentSession } from "./session";

export const [getSolves, setSolves] = createSignal<(Saved<Solve> | Solve)[]>(
  []
);

export const [isSavingSolve, setIsSavingSolve] = createSignal(false);

// for some reason, not using the spread operator mutates the signal
export const getSolvesAscending = createMemo(() =>
  [...getSolves()].sort((a, b) => a.timestamp - b.timestamp)
);

export const getSolvesDescending = createMemo(() =>
  [...getSolves()].sort((a, b) => b.timestamp - a.timestamp)
);

export function getLastSolve(): Solve | Saved<Solve> | undefined {
  return getSolvesAscending().at(-1);
}

export async function addSolve(
  time: number,
  user: User | null,
  isPlusTwo = false
): Promise<void> {
  if (isSavingSolve()) {
    Notifications.add({
      type: "error",
      message: "Cannot add solve while a solve is saving"
    });

    return;
  }

  const roundedTime = roundToMilliseconds(time);

  const unsavedSolve: Solve = {
    time: roundedTime,
    timestamp: Date.now(),
    scramble: getScramble(),
    session: currentSession.name,
    enteredBy: config.timerType,
    penalty: isPlusTwo ? "+2" : "OK"
  };

  const userID = user?.uid;

  setSolves((solves) => [...solves, unsavedSolve]);

  if (user !== null && userID !== undefined) {
    setIsSavingSolve(true);

    const almostSavedSolve: AlmostSaved<Solve> = {
      ...unsavedSolve,
      userID
    };

    const response = await API.solves.save(almostSavedSolve);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to save solve\n${response.message}`
      });

      revertScramble();
      deleteSolve(unsavedSolve, user);
      revertScramble();
      setIsSavingSolve(false);

      return;
    }

    const savedSolve = response.data;

    if (savedSolve === undefined) {
      setAndGenerateScramble();

      return;
    }

    addIDToSolve(unsavedSolve, savedSolve.insertedID, user);

    setIsSavingSolve(false);

    console.log("Saved solve to database");
  }
}

export async function deleteSolve(
  solve: Saved<Solve> | Solve,
  user: User | null
): Promise<void> {
  setSolves((solves) => solves.filter((s) => s !== solve));

  if (user !== null && isSavedSolve(solve)) {
    const response = await API.solves.delete(solve);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to delete solve\n${response.message}`
      });

      return;
    }

    console.log("Deleted solve from database");
  }
}

export async function updateSolve(
  solve: Saved<Solve> | Solve,
  toChange: Partial<Saved<Solve>>,
  user: User | null,
  db = true
): Promise<void> {
  const newSolve = { ...solve, ...toChange };

  setSolves((solves) => solves.map((s) => (s === solve ? newSolve : s)));

  if (db && user !== null && isSavedSolve(newSolve)) {
    const response = await API.solves.update(newSolve);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to update solve\n${response.message}`
      });

      return;
    }

    console.log("Updated solve in database");
  }
}

export function addIDToSolve(
  solve: Solve,
  id: Types.ObjectId,
  user: User | null
): void {
  updateSolve(solve, { _id: id, userID: user?.uid }, user, false);
}

export async function deleteAll(user: User | null): Promise<void> {
  if (getSolves().length === 0) {
    return;
  }

  setSolves([]);

  if (user !== null) {
    const response = await API.solves.deleteAll();

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to delete all solves\n${response.message}`
      });

      return;
    }

    console.log("Deleted all solves from database");
  }
}

export function isSavedSolve(
  solve: Partial<Saved<Solve>>
): solve is Saved<Solve> {
  return solve._id !== undefined && !!solve.userID;
}
