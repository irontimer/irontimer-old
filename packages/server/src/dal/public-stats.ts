import prisma from "../init/db";
import { roundTo2 } from "../utils/misc";

export async function updateStats(time: number): Promise<boolean> {
  await prisma.publicStats.update({
    where: {
      type: "stats"
    },
    data: {
      solveCount: {
        increment: 1
      },
      timeSolving: {
        increment: roundTo2(time)
      }
    }
  });

  return true;
}
