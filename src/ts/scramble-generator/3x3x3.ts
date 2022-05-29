import { SCRAMBLE_FACES } from "../../constants/scramble-type";
import { randomBoolean } from "../functions/random";
import { areParallelCubeFaces } from "./are-parallel";

const faces = SCRAMBLE_FACES["3x3x3"];

export function generate3x3x3Scramble(length: number): string {
  let scramble = "";

  let lastFaces: [string | null, string | null] = [null, null];

  for (let i = 0; i < length; i++) {
    let randomFace = faces[Math.floor(Math.random() * faces.length)];

    while (
      lastFaces[1] === randomFace ||
      (lastFaces[0] !== null &&
        areParallelCubeFaces(faces, lastFaces[0], randomFace))
    ) {
      randomFace = faces[Math.floor(Math.random() * faces.length)];
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
