/** @format */

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

export interface Move {
  side:
    | "Up"
    | "Down"
    | "Left"
    | "Right"
    | "Front"
    | "Back"
    | "UpWide"
    | "DownWide"
    | "LeftWide"
    | "RightWide"
    | "FrontWide"
    | "BackWide";
  count: number;
  direction: "Clockwise" | "CounterClockwise";
}

export interface Result {
  time: number; // float seconds for how long the solve was
  timestamp: number;
  puzzle: Puzzle;
  scramble: Move[];
  solution?: Move[];
}
