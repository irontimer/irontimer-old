import { createSignal } from "solid-js";
import { Move, FACES, DIRECTIONS, Face } from "../structures/Move";
import { Puzzle } from "../types/types";

export function generateScramble(puzzle: Puzzle, length?: number): Move[] {
  switch (puzzle.type) {
    case "Megaminx":
    case "Pyraminx":
    case "Skewb":
    case "Square-1":
    case "Cube":
      // return generateMegaminxScramble(length ?? 50);
      // return generatePyraminxScramble(length ?? 15);
      // return generateSkewbScramble(length ?? 15);
      // return generateSquare1Scramble(length ?? 20);
      return generateCubeScramble(length ?? 20);
  }
}

function generateCubeScramble(length: number): Move[] {
  const moves: Move[] = [];

  let lastFace: Face = "BackWide";

  for (let i = 0; i < length; i++) {
    const normalFaces = FACES.filter((face) => !face.endsWith("Wide"));

    let randomFace =
      normalFaces[Math.floor(Math.random() * normalFaces.length)];

    while (randomFace === lastFace) {
      randomFace = normalFaces[Math.floor(Math.random() * normalFaces.length)];
    }

    lastFace = randomFace;

    const randomDirection =
      DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const count = Math.floor(Math.random() * 3) + 1;

    const move = new Move(randomFace, count, randomDirection);

    moves.push(move);
  }

  return moves;
}

export const [getScramble, setScramble] = createSignal<Move[]>([]);
