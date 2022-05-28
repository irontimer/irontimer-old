import { createEffect, createSignal } from "solid-js";
import { FACES, ScrambleType } from "../../constants/scramble-type";
import { randomBoolean } from "../functions/random";
import { getResults } from "./result";

export function generateScramble(
  scrambleType: ScrambleType,
  length?: number
): string {
  switch (scrambleType) {
    case "3x3x3":
      return generateCubeScramble(length ?? 25);
    case "2x2x2":
      return generateCubeScramble(length ?? 25);
  }
}

function generateCubeScramble(length: number): string {
  let scramble = "";

  const faces = FACES[getScrambleType()];

  let lastFace = faces[Math.floor(Math.random() * faces.length)];

  for (let i = 0; i < length; i++) {
    const normalFaces = faces.filter((face) => !face.endsWith("Wide"));

    let randomFace =
      normalFaces[Math.floor(Math.random() * normalFaces.length)];

    while (randomFace === lastFace) {
      randomFace = normalFaces[Math.floor(Math.random() * normalFaces.length)];
    }

    lastFace = randomFace;

    const randomDirection = randomBoolean();
    const count = randomBoolean();

    scramble += `${randomFace}${count ? "" : "2"}${
      randomDirection && count ? "'" : ""
    } `;
  }

  return scramble.trim();
}

export const [getScrambleType, setScrambleType] =
  createSignal<ScrambleType>("3x3x3");
export const [getScramble, setScramble] = createSignal("");

createEffect(() => {
  // Update scramble when results list changes
  // Basically, calling a signal is like a dependency array in React
  getResults();

  // This also updates a scramble when the scramble type changes
  setScramble(generateScramble(getScrambleType()));
});
