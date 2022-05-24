import { PublicStats } from "../models/public-stats";
import { roundTo2 } from "../utils/misc";

export async function updateStats(time: number): Promise<boolean> {
  await PublicStats.updateOne(
    { type: "stats" },
    {
      $inc: {
        resultCount: 1,
        timeCubing: roundTo2(time)
      }
    },
    { upsert: true }
  );

  return true;
}
