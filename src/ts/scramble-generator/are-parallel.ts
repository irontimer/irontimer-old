export function areParallelCubeFaces(
  faces: string[],
  face1: string,
  face2: string
): boolean {
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
