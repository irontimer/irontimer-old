import { ScrambleType } from "../types";

export const SCRAMBLE_TYPES: ScrambleType[] = ["3x3x3", "2x2x2"]; // TODO add more scramble types

export const SCRAMBLE_FACES: Record<ScrambleType, string[]> = {
  "3x3x3": ["U", "D", "L", "R", "F", "B"],
  "2x2x2": ["U", "R", "F"]
};
