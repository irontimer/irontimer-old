import { ScrambleType } from "../../types";
import { generate2x2x2Scramble } from "./2x2x2";
import { generate3x3x3Scramble } from "./3x3x3";

export function generateScramble(
  scrambleType: ScrambleType,
  length?: number
): string {
  switch (scrambleType) {
    case "3x3x3":
      return generate3x3x3Scramble(length ?? 25);

    case "2x2x2":
      return generate2x2x2Scramble(length ?? 10);

    default:
      return "unimplemented scramble type";
  }
}
