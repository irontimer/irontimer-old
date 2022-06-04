import { createEffect, createSignal } from "solid-js";
import { DEFAULT_SCRAMBLE_TYPE } from "../../constants/scramble-type";
import { generateScramble } from "../scramble-generator";
import { getResults } from "./result";
import { getConfigChange } from "./config";
import { currentSession, setCurrentSession } from "./session";

export const [getScramble, setScramble] = createSignal("");

export function setAndGenerateScramble(
  scrambleType = currentSession.scrambleType ?? DEFAULT_SCRAMBLE_TYPE
): void {
  if (scrambleType === currentSession.scrambleType) {
    setScramble(generateScramble(scrambleType));
  } else {
    // prompt the user if they want to change the scramble type on the session
    // if they do, set the scramble type to the new value
    // if they don't, do nothing
    if (
      window.confirm(
        `Changing the scramble type will reset the session. Are you sure you want to change the scramble type to ${scrambleType}?`
      )
    ) {
      setCurrentSession("scrambleType", scrambleType);

      setScramble(generateScramble(scrambleType));
    }
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
