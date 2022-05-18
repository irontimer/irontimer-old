/** @format */

import { Move } from "../structures/move";

export type PuzzleType =
  | "Cube"
  | "Megaminx"
  | "Pyraminx"
  | "Skewb"
  | "Square-1";

export interface Puzzle {
  type: PuzzleType;
  layers: number;
}

export interface Result {
  time: number; // float seconds for how long the solve was
  timestamp: number;
  puzzle: Puzzle;
  scramble: Move[];
  solution?: Move[];
}
