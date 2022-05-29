import { createEffect, createSignal } from "solid-js";
import { DEFAULT_SCRAMBLE_TYPE } from "../../constants/scramble-type";
import type { ScrambleType } from "../../constants/scramble-type";
import { generateScramble } from "../scramble-generator";
import { getResults } from "./result";

export const [getScrambleType, setScrambleType] = createSignal<ScrambleType>(
  DEFAULT_SCRAMBLE_TYPE
);
export const [getScramble, setScramble] = createSignal("");

export function setAndGenerateScramble(scrambleType?: ScrambleType): void {
  scrambleType ??= getScrambleType();

  if (scrambleType === getScrambleType()) {
    setScramble(generateScramble(scrambleType));
  } else {
    setScrambleType(scrambleType);
  }
}

createEffect(() => {
  // Update scramble when results list changes
  // Basically, calling a signal is like a dependency array in React
  getResults();

  // This also updates a scramble when the scramble type changes
  setScramble(generateScramble(getScrambleType()));
});
