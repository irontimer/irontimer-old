/** @format */

import { Move } from "../structures/Move";
import { Puzzle } from "../structures/Puzzle";

export interface Result {
  time: number; // float seconds for how long the solve was
  timestamp: number;
  puzzle: Puzzle;
  scramble: Move[];
  solution?: Move[];
}

export interface User {
  userID: string;
  email: string;
  username: string;
  discordUserID: string;
}
