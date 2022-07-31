import * as SolveDAL from "../../dal/solve";
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
import { isSolveTooFast } from "../../utils/validation";
import IronTimerStatusCodes from "../../constants/irontimer-status-codes";
import { incrementSolve } from "../../utils/prometheus";
import * as Bot from "../../tasks/bot";
import {
  Request,
  Solve,
  SolveCreationResult,
  Saved,
  DEFAULT_SCRAMBLE_TYPE
} from "utils";
import { Types } from "mongoose";
import _ from "lodash";
import { actualTime } from "../../utils/misc";

export async function getSolves(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const solves = await SolveDAL.getSolves(userID);

  return new IronTimerResponse("Solves retrieved", solves);
}

export async function getLastSolve(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const solves = await SolveDAL.getLastSolve(userID);

  return new IronTimerResponse("Solve retrieved", solves);
}

export async function updateSolve(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { solve } = req.body;
  const solveID = new Types.ObjectId(req.params.id);

  const toChange: Partial<Pick<Solve, "solution" | "penalty">> = _.pickBy(
    solve as Solve,
    (_value, key) => ["solution", "penalty"].includes(key)
  );

  const updateResult = await SolveDAL.updateSolve(userID, solveID, toChange);

  if (updateResult.modifiedCount === 0) {
    throw new IronTimerError(
      404,
      `Solve not found\nSolve ID: ${solveID}`,
      "update solve"
    );
  }

  return new IronTimerResponse("Solve updated", updateResult);
}

export async function deleteAll(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  await SolveDAL.deleteAll(userID);

  Logger.logToDb("user_solves_deleted", "", userID);

  return new IronTimerResponse("All solves deleted");
}

export async function deleteSolve(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const solveID = new Types.ObjectId(req.params.id);

  await SolveDAL.deleteSolve(userID, solveID);

  Logger.logToDb("user_solve_deleted", "", userID);

  return new IronTimerResponse("Solve deleted");
}

export async function addSolve(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const user = await getUser(userID, "add solve");

  const solve: Saved<Solve> = Object.assign({}, req.body.solve);

  const session = await SessionDAL.getSession(userID, solve.session);

  if (session === undefined) {
    throw new IronTimerError(
      IronTimerStatusCodes.SESSION_NOT_FOUND.code,
      IronTimerStatusCodes.SESSION_NOT_FOUND.message
    );
  }

  solve.userID = userID;

  if (isSolveTooFast(solve, session)) {
    const status = IronTimerStatusCodes.SOLVE_TOO_FAST;
    throw new IronTimerError(status.code, status.message);
  }

  // Convert solve time to miliseconds
  const timeMilliseconds = solve.time * 1000;

  // Get latest solve's timestamp
  const lastSolveTimestamp = (
    await SolveDAL.getLastSolve(userID).catch(() => undefined)
  )?.timestamp;

  // Check if now is earlier than last solve plus duration
  const earliestPossible =
    (lastSolveTimestamp ?? Date.now()) + timeMilliseconds;

  const nowMilliseconds = Math.floor(Date.now() / 1000) * 1000;

  if (lastSolveTimestamp && nowMilliseconds < earliestPossible) {
    Logger.logToDb(
      "invalid_solve_spacing",
      {
        lastTimestamp: lastSolveTimestamp,
        earliestPossible,
        now: nowMilliseconds,
        time: timeMilliseconds,
        difference: nowMilliseconds - earliestPossible
      },
      userID
    );

    const status = IronTimerStatusCodes.SOLVE_SPACING_INVALID;

    throw new IronTimerError(status.code, "Invalid solve spacing");
  }

  const isPersonalBest = await checkIfPersonalBest(userID, user, solve);

  if (isPersonalBest) {
    solve.isPersonalBest = true;
  }

  if (session.scrambleType === DEFAULT_SCRAMBLE_TYPE) {
    incrementCubes(userID, solve);

    if (isPersonalBest && user.discordUserID) {
      Bot.updateDiscordRole(user.discordUserID, actualTime(solve));
    }
  }

  // if (solve.challenge && user.discordUserID) {
  //   Bot.awardChallenge(user.discordUserID, solve.challenge);
  // } else {
  //   delete solve.challenge;
  // }

  updateTypingStats(userID, solve.time);
  PublicStatsDAL.updateStats(solve.time);

  const addedSolveID = await SolveDAL.addSolve(userID, solve);

  if (isPersonalBest) {
    Logger.logToDb(
      "user_new_pb",
      `${session.scrambleType} ${actualTime(solve)} ${
        solve.scramble
      } (${addedSolveID})`,
      userID
    );
  }

  const solveCreationResult: SolveCreationResult = {
    isPersonalBest,
    username: user.username,
    insertedID: addedSolveID
  };

  incrementSolve(solve);

  return new IronTimerResponse("Solve saved", solveCreationResult);
}
