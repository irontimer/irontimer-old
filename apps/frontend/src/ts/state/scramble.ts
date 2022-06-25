import { createSignal } from "solid-js";
import { DEFAULT_SCRAMBLE_TYPE } from "@irontimer/utils";
import { generateScramble } from "../scramble-generator";
import { currentSession, setCurrentSession } from "./session";

export const [getPreviousScramble, setPreviousScramble] = createSignal("");
export const [getScramble, setScramble] = createSignal("");

export function setAndGenerateScramble(
  scrambleType = currentSession.scrambleType ?? DEFAULT_SCRAMBLE_TYPE
): void {
  if (scrambleType === currentSession.scrambleType) {
    setPreviousScramble(getScramble());
    setScramble(generateScramble(scrambleType));
  } else if (
    window.confirm(
      `Changing the scramble type will reset the session. Are you sure you want to change the scramble type to ${scrambleType}?`
    )
  ) {
    setCurrentSession("scrambleType", scrambleType);

    setPreviousScramble(getScramble());
    setScramble(generateScramble(scrambleType));
  }
}

export function revertScramble(): void {
  setScramble(getPreviousScramble());
  setPreviousScramble("");
}
