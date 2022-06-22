import {
  FaceOf,
  ScrambleType,
  SCRAMBLE_FACES,
  TURN_COUNT_PER_CYCLE
} from "@irontimer/utils";
import { randomBoolean, randomInteger } from "../utils/misc";
import { isRedundant } from "./redudancy-check";

export function* randomMoveGenerator<T extends ScrambleType>(
  type: T,
  length: number
): Generator<string> {
  const faces = SCRAMBLE_FACES[type];

  const turnCount = TURN_COUNT_PER_CYCLE[type];

  const lastFaces: FaceOf<T>[] = [];

  for (let i = 0; i < length; i++) {
    let randomFace = faces[randomInteger(0, faces.length)];

    while (isRedundant(faces, ...lastFaces, randomFace)) {
      randomFace = faces[randomInteger(0, faces.length)];
    }

    if (lastFaces.length === faces.length / 3) {
      lastFaces.shift();
    }

    lastFaces.push(randomFace);

    const direction = randomBoolean();
    const count = randomInteger(1, turnCount - 1);

    const showCount = count !== 1;
    const showDirection = direction && (!showCount || turnCount !== 4);

    const move = `${randomFace}${showCount ? count : ""}${
      showDirection ? "'" : ""
    }`;

    yield move;
  }

  return;
}
