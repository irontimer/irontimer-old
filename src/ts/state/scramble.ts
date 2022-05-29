import { createEffect, createSignal } from "solid-js";
import {
  DEFAULT_SCRAMBLE_TYPE,
  ScrambleType
} from "../../constants/scramble-type";
import { generateScramble } from "../scramble-generator";
import { getResults } from "./result";
import { config, getConfigChange, setConfig } from "./config";

export const [getScramble, setScramble] = createSignal("");

export function setAndGenerateScramble(scrambleType?: ScrambleType): void {
  scrambleType ??= config.scrambleType ?? DEFAULT_SCRAMBLE_TYPE;

  if (scrambleType === config.scrambleType) {
    setScramble(generateScramble(scrambleType));
  } else {
    setConfig("scrambleType", scrambleType);
  }
}

createEffect(() => {
  // Update scramble when results list changes
  // Basically, calling a signal is like a dependency array in React
  getResults();
  getConfigChange();

  // This also updates a scramble when the scramble type changes
  setAndGenerateScramble();
});
