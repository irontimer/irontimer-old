import _ from "lodash";
import type {
  Solve as ISolve,
  Saved,
  User,
  UpdateResult,
  DeleteResult
} from "../../types";
import { Solve } from "../models/solve";
import { Types } from "mongoose";
import IronTimerError from "../utils/error";

import { getUser } from "./user";

export async function addSolve(
  userID: string,
  solve: Partial<Saved<ISolve>>
): Promise<Types.ObjectId> {
  const user: User | undefined = await getUser(userID, "add solve").catch(
    () => undefined
  );

  if (user === undefined) {
    throw new IronTimerError(404, "User not found", "add solve");
  }

  if (solve.userID === undefined) {
    solve.userID = userID;
  }

  const _id = new Types.ObjectId();

  const newSolve = await Solve.create({
    ...solve,
    _id
  });

  return newSolve._id;
}

export async function deleteAll(userID: string): Promise<DeleteResult> {
  return await Solve.deleteMany({ userID });
}

export async function deleteSolve(
  userID: string,
  solveID: Types.ObjectId
): Promise<DeleteResult> {
  return await Solve.deleteOne({ userID, _id: solveID });
}

export async function getSolve(
  userID: string,
  id: string
): Promise<Saved<ISolve>> {
  const solve = await Solve.findOne({ _id: id, userID });

  if (solve === null) {
    throw new IronTimerError(404, "Solve not found");
  }

  return solve;
}

export async function getLastSolve(
  userID: string
): Promise<Partial<Saved<ISolve>>> {
  const [lastSolve] = await Solve.find({ userID })
    .sort({ timestamp: -1 })
    .limit(1);

  if (!lastSolve) {
    throw new IronTimerError(404, "No solves found");
  }

  return _.omit(lastSolve, "userID");
}

export async function updateSolve(
  userID: string,
  solveID: Types.ObjectId,
  solve: Partial<Saved<ISolve>>
): Promise<UpdateResult> {
  return await Solve.updateOne({ _id: solveID, userID }, { $set: solve });
}

export async function getSolveByTimestamp(
  userID: string,
  timestamp: number
): Promise<Saved<ISolve> | undefined> {
  return (await Solve.findOne({ userID, timestamp })) ?? undefined;
}

export async function getSolves(
  userID: string,
  start = 0,
  end = 1000
): Promise<Saved<ISolve>[]> {
  const solves = await Solve.find({ userID })
    .sort({ timestamp: -1 })
    .skip(start)
    .limit(end); // this needs to be changed to later take patreon into consideration

  if (!solves) {
    throw new IronTimerError(404, "Solves not found");
  }

  return solves;
}
