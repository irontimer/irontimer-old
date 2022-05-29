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

type Face = string | null;

function generateCubeScramble(length: number): string {
  let scramble = "";

  const faces = FACES[getScrambleType()];

  let lastFaces: [Face, Face] = [null, null];

  for (let i = 0; i < length; i++) {
    const normalFaces = faces.filter((face) => !face.endsWith("Wide"));

    let randomFace =
      normalFaces[Math.floor(Math.random() * normalFaces.length)];

    while (
      lastFaces[1] === randomFace ||
      areParallel(faces, lastFaces[0], randomFace)
    ) {
      randomFace = normalFaces[Math.floor(Math.random() * normalFaces.length)];
    }

    lastFaces = [lastFaces[1], randomFace];

    const randomDirection = randomBoolean();
    const count = randomBoolean();

    scramble += `${randomFace}${count ? "" : "2"}${
      randomDirection && count ? "'" : ""
    } `;
  }

  return scramble.trim();
}

function areParallel(faces: string[], face1: Face, face2: Face): boolean {
  if (face1 === null || face2 === null) {
    return false;
  }

  // all parallel faces are within each third of the faces array
  const threshold = faces.length / 3;
  const thresholds = [threshold, threshold * 2, threshold * 3];

  const face1Index = faces.indexOf(face1);
  const face2Index = faces.indexOf(face2);

  // check each third to see if the two sides are in the same third
  return thresholds.some((max) => {
    const min = max - threshold;

    return (
      face1Index >= min &&
      face1Index < max &&
      face2Index >= min &&
      face2Index < max
    );
  });
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
