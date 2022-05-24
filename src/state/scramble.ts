import { createSignal } from "solid-js";
import { ScrambleType } from "../constants/scramble-type";

export function generateScramble(
  scrambleType: ScrambleType,
  length?: number
): string {
  switch (scrambleType) {
    case "3x3x3":
      return generateCubeScramble(length ?? 25);
  }
}

function generateCubeScramble(length: number): string {
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

export const [getScrambleType, setScrambleType] =
  createSignal<ScrambleType>("3x3x3");
export const [getScramble, setScramble] = createSignal(
  generateScramble(getScrambleType())
);
