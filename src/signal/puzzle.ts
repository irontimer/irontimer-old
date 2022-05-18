import { createSignal } from "solid-js";
import type { Puzzle } from "../types/types";

export const [getPuzzle, setPuzzle] = createSignal<Puzzle>({
  type: "Cube",
  size: 3
});
