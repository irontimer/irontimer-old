import { DEFAULT_SCRAMBLE_LENGTH, ScrambleType } from "utils";
import { randomMoveGenerator } from "./random-move-generator";

export function generateScramble(
  scrambleType: ScrambleType,
  length?: number
): string {
  const l = length ?? DEFAULT_SCRAMBLE_LENGTH[scrambleType];

  const gen = randomMoveGenerator(scrambleType, l);

  const scramble: string[] = [];

  for (const move of gen) {
    scramble.push(move);
  }

  return scramble.join(" ");
}
