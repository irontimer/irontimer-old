import _ from "lodash";
import type { SavedResult as IResult, User } from "../../types";
import { Result } from "../models/result";
import { DeleteResult } from "mongodb";
import { Types } from "mongoose";
import IronTimerError from "../utils/error";

import { getUser } from "./user";

export async function addResult(
  userID: string,
  result: IResult
): Promise<{ insertedID: Types.ObjectId }> {
  const user: User | undefined = await getUser(userID, "add result").catch(
    () => undefined
  );

  if (user === undefined) {
    throw new IronTimerError(404, "User not found", "add result");
  }

  if (result.userID === undefined) {
    result.userID = userID;
  }

  const _id = new Types.ObjectId();

  await Result.create({
    ...result,
    _id
  });

  return {
    insertedID: _id
  };
}

export async function deleteAll(userID: string): Promise<DeleteResult> {
  return await Result.deleteMany({ userID });
}

export async function deleteResult(
  userID: string,
  resultID: Types.ObjectId
): Promise<DeleteResult> {
  return await Result.deleteOne({ userID, _id: resultID });
}

export async function getResult(userID: string, id: string): Promise<IResult> {
  const result = await Result.findOne({ _id: id, userID });

  if (result === null) {
    throw new IronTimerError(404, "Result not found");
  }

  return result;
}

export async function getLastResult(userID: string): Promise<Partial<IResult>> {
  const [lastResult] = await Result.find({ userID })
    .sort({ timestamp: -1 })
    .limit(1);

  if (!lastResult) {
    throw new IronTimerError(404, "No results found");
  }

  return _.omit(lastResult, "userID");
}

export async function getResultByTimestamp(
  userID: string,
  timestamp: number
): Promise<IResult | undefined> {
  return (await Result.findOne({ userID, timestamp })) ?? undefined;
}

export async function getResults(
  userID: string,
  start = 0,
  end = 1000
): Promise<IResult[]> {
  const results = await Result.find({ userID })
    .sort({ timestamp: -1 })
    .skip(start)
    .limit(end); // this needs to be changed to later take patreon into consideration

  if (!results) {
    throw new IronTimerError(404, "Results not found");
  }

  return results;
}
