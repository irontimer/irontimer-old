import { createSignal } from "solid-js";
import { Puzzle } from "../structures/Puzzle";

export const [getPuzzle, setPuzzle] = createSignal<Puzzle>(
  new Puzzle("Cube", 3)
);
