export type ScrambleType = "3x3x3" | "2x2x2";

export type FacesOf<T extends ScrambleType> = typeof SCRAMBLE_FACES[T];

export type FaceOf<T extends ScrambleType> = FacesOf<T>[number];

export const SCRAMBLE_TYPES: ScrambleType[] = ["3x3x3", "2x2x2"]; // TODO add more scramble types

export const DEFAULT_SCRAMBLE_TYPE: ScrambleType = "3x3x3";

export const SCRAMBLE_FACES: Record<ScrambleType, string[]> = {
  "3x3x3": ["U", "D", "L", "R", "F", "B"],
  "2x2x2": ["U", "R", "F"]
};

export const MINIMUM_NECESSARY_TIME: Record<ScrambleType, number> = {
  "3x3x3": 3.47,
  "2x2x2": 0.5
};

export const TURN_COUNT_PER_CYCLE: Record<ScrambleType, number> = {
  "3x3x3": 4,
  "2x2x2": 4
};

export const DEFAULT_SCRAMBLE_LENGTH: Record<ScrambleType, number> = {
  "3x3x3": 25,
  "2x2x2": 10
};
