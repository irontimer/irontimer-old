import { FaceOf, FacesOf, ScrambleType } from "../../constants/scramble-type";

/**
 * @description A face is considered redundant if (in comparison to it's previous faces) it is a repetition of the same face without any of its pieces moving out of that layer after it was previously moved.
 * @example 3x3x3: ["F", "D", "F"] // not redundant
 * @example 3x3x3: ["F", "B", "F"] // redundant as it is equivalent to ["B", "F2"]
 */
export function isRedundant<T extends ScrambleType>(
  faces: FacesOf<T>,
  ...toCheck: FaceOf<T>[]
): boolean {
  if (toCheck.length < 2) {
    return false;
  }

  // the new face is redundant if it is the same as the last face
  if (toCheck.at(-1) === toCheck.at(-2)) {
    return true;
  }

  // all parallel faces are within each third of the faces array
  const threshold = faces.length / 3;
  const thresholds = [threshold, threshold * 2, threshold * 3];

  // check each third to see if all sides are in the same third
  return thresholds.some((max) => {
    const min = max - threshold;

    return toCheck.every((face) => {
      const index = faces.indexOf(face);

      return index >= min && index < max;
    });
  });
}
