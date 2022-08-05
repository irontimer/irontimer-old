import type { Prisma, Solve, Unsaved, User } from "utils";
import prisma from "../init/db";
import IronTimerError from "../utils/error";
import { getUser } from "./user";

export async function addSolve(
  uid: string,
  solve: Unsaved<Solve>
): Promise<string> {
  const user: User | undefined = await getUser(uid, "add solve").catch(
    () => undefined
  );

  if (user === undefined) {
    throw new IronTimerError(404, "User not found", "add solve");
  }

  if (solve.uid === undefined) {
    solve.uid = uid;
  }

  const newSolve = await prisma.solve.create({
    data: solve
  });

  return newSolve.id;
}

export async function deleteAll(uid: string): Promise<Prisma.BatchPayload> {
  return await prisma.solve.deleteMany({ where: { uid } });
}

export async function deleteSolve(
  uid: string,
  solveId: string
): Promise<Prisma.BatchPayload> {
  return await prisma.solve.deleteMany({ where: { uid, id: solveId } });
}

export async function getSolve(uid: string, id: string): Promise<Solve> {
  const solve = await prisma.solve.findFirst({
    where: {
      id,
      uid
    }
  });

  if (solve === null) {
    throw new IronTimerError(404, "Solve not found");
  }

  return solve;
}

export async function getLastSolve(uid: string): Promise<Solve> {
  const [lastSolve] = (await prisma.solve.findMany({ where: { uid } })).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  if (!lastSolve) {
    throw new IronTimerError(404, "No solves found");
  }

  return lastSolve;
}

export async function updateSolve(
  uid: string,
  solveId: string,
  solve: Partial<Solve>
): Promise<Solve> {
  const existing = await getSolve(uid, solveId);

  if (!existing) {
    throw new IronTimerError(404, "Solve not found");
  }

  return await prisma.solve.update({
    where: { id: solveId },
    data: solve
  });
}

export async function getSolveByTimestamp(
  uid: string,
  timestamp: number
): Promise<Solve | undefined> {
  return (
    (await prisma.solve.findFirst({
      where: { uid, createdAt: new Date(timestamp) }
    })) ?? undefined
  );
}

export async function getSolves(
  uid: string,
  start = 0,
  end = 1000
): Promise<Solve[]> {
  const solves = (await prisma.solve.findMany({ where: { uid } }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(start, end); // this needs to be changed to later take patreon into consideration

  if (!solves) {
    throw new IronTimerError(404, "Solves not found");
  }

  return solves;
}
