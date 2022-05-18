import { Result } from "../types/types";

export function calculateAverage(
  results: Result[],
  averageOf = 5
): number | undefined {
  if (averageOf === 5) {
    console.log(results);
  }
  if (results.length < averageOf) {
    return;
  }

  const meanLength = averageOf - 2;

  const sortedResultsWithoutBestAndWorst = results
    .slice(results.length - averageOf)
    .sort((a, b) => a.time - b.time)
    .slice(1, results.length - 1);

  const mean =
    sortedResultsWithoutBestAndWorst.reduce((acc, curr) => acc + curr.time, 0) /
    meanLength;

  return mean;
}
