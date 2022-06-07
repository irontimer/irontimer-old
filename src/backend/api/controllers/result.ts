import * as ResultDAL from "../../dal/result";
import * as SessionDAL from "../../dal/session";
import {
  getUser,
  checkIfPersonalBest,
  incrementCubes,
  updateTypingStats
} from "../../dal/user";
import * as PublicStatsDAL from "../../dal/public-stats";
import Logger from "../../utils/logger";
import { IronTimerResponse } from "../../utils/irontimer-response";
import IronTimerError from "../../utils/error";
import { isResultTooFast } from "../../utils/validation";
import IronTimerStatusCodes from "../../constants/irontimer-status-codes";
import { incrementResult } from "../../utils/prometheus";
import * as Bot from "../../tasks/bot";
import { Request, Result, Saved } from "../../../types";
import { Types } from "mongoose";
import { DEFAULT_SCRAMBLE_TYPE } from "../../../constants/scramble-type";
import _ from "lodash";
import { actualTime } from "../../utils/misc";

export async function getResults(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const results = await ResultDAL.getResults(userID);

  return new IronTimerResponse("Results retrieved", results);
}

export async function getLastResult(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const results = await ResultDAL.getLastResult(userID);

  return new IronTimerResponse("Result retrieved", results);
}

export async function updateResult(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { result } = req.body;
  const resultID = new Types.ObjectId(req.params.id);

  const toChange: Partial<Pick<Result, "solution" | "penalty">> = _.pickBy(
    result as Result,
    (_value, key) => ["solution", "penalty"].includes(key)
  );

  const updateResult = await ResultDAL.updateResult(userID, resultID, toChange);

  if (updateResult.modifiedCount === 0) {
    throw new IronTimerError(
      404,
      `Result not found\nResult ID: ${resultID}`,
      "update result"
    );
  }

  return new IronTimerResponse("Result updated", updateResult);
}

export async function deleteAll(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  await ResultDAL.deleteAll(userID);

  Logger.logToDb("user_results_deleted", "", userID);

  return new IronTimerResponse("All results deleted");
}

export async function deleteResult(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const resultID = new Types.ObjectId(req.params.id);

  await ResultDAL.deleteResult(userID, resultID);

  Logger.logToDb("user_result_deleted", "", userID);

  return new IronTimerResponse("Result deleted");
}

export async function addResult(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const user = await getUser(userID, "add result");

  const result: Saved<Result> = Object.assign({}, req.body.result);

  const session = await SessionDAL.getSession(userID, result.session);

  if (session === undefined) {
    throw new IronTimerError(
      IronTimerStatusCodes.SESSION_NOT_FOUND.code,
      IronTimerStatusCodes.SESSION_NOT_FOUND.message
    );
  }

  result.userID = userID;

  if (isResultTooFast(result, session)) {
    const status = IronTimerStatusCodes.RESULT_TOO_FAST;
    throw new IronTimerError(status.code, status.message);
  }

  // Convert result time to miliseconds
  const timeMilliseconds = result.time * 1000;

  // Get latest result by timestamp
  const lastResultTimestamp = (
    await ResultDAL.getLastResult(userID).catch(() => undefined)
  )?.timestamp;

  // Check if now is earlier than last result plus duration (no buffer because of scramble time)
  const earliestPossible =
    (lastResultTimestamp ?? Date.now()) + timeMilliseconds;

  const nowMilliseconds = Math.floor(Date.now() / 1000) * 1000;

  if (lastResultTimestamp && nowMilliseconds < earliestPossible) {
    Logger.logToDb(
      "invalid_result_spacing",
      {
        lastTimestamp: lastResultTimestamp,
        earliestPossible,
        now: nowMilliseconds,
        time: timeMilliseconds,
        difference: nowMilliseconds - earliestPossible
      },
      userID
    );

    const status = IronTimerStatusCodes.RESULT_SPACING_INVALID;

    throw new IronTimerError(status.code, "Invalid result spacing");
  }

  const isPersonalBest = await checkIfPersonalBest(userID, user, result);

  if (isPersonalBest) {
    result.isPersonalBest = true;
  }

  if (session.scrambleType === DEFAULT_SCRAMBLE_TYPE) {
    incrementCubes(userID, result);

    if (isPersonalBest && user.discordUserID) {
      Bot.updateDiscordRole(user.discordUserID, actualTime(result));
    }
  }

  // if (result.challenge && user.discordUserID) {
  //   Bot.awardChallenge(user.discordUserID, result.challenge);
  // } else {
  //   delete result.challenge;
  // }

  updateTypingStats(userID, result.time);
  PublicStatsDAL.updateStats(result.time);

  const addedResult = await ResultDAL.addResult(userID, result);

  if (isPersonalBest) {
    Logger.logToDb(
      "user_new_pb",
      `${session.scrambleType} ${actualTime(result)} ${result.scramble} (${
        addedResult.insertedID
      })`,
      userID
    );
  }

  const data = {
    isPersonalBest,
    username: user.username,
    insertedID: addedResult.insertedID
  };

  incrementResult(result);

  return new IronTimerResponse("Result saved", data);
}
