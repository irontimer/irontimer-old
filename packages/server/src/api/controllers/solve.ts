import { ScrambleType } from "@prisma/client";
import _ from "lodash";
import { Request, Solve, SolveCreationResult } from "utils";
import IronTimerStatusCodes from "../../constants/irontimer-status-codes";
import * as PublicStatsDAL from "../../dal/public-stats";
import * as SessionDAL from "../../dal/session";
import * as SolveDAL from "../../dal/solve";
import {
  checkIfPersonalBest,
  getUser,
  incrementCubes,
  updateTypingStats
} from "../../dal/user";
import * as Bot from "../../tasks/bot";
import IronTimerError from "../../utils/error";
import { IronTimerResponse } from "../../utils/irontimer-response";
import Logger from "../../utils/logger";
import { actualTime } from "../../utils/misc";
import { incrementSolve } from "../../utils/prometheus";
import { isSolveTooFast } from "../../utils/validation";

export async function getSolves(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const solves = await SolveDAL.getSolves(uid);

  return new IronTimerResponse("Solves retrieved", solves);
}

export async function getLastSolve(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const solves = await SolveDAL.getLastSolve(uid);

  return new IronTimerResponse("Solve retrieved", solves);
}

export async function updateSolve(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { solve } = req.body;
  const { id } = req.params;

  const toChange: Partial<Pick<Solve, "solution" | "penalty">> = _.pickBy(
    solve as Solve,
    (_value, key) => ["solution", "penalty"].includes(key)
  );

  const updatedSolve = await SolveDAL.updateSolve(uid, id, toChange);

  if (!updatedSolve) {
    throw new IronTimerError(
      404,
      `Solve not found\nSolve Id: ${id}`,
      "update solve"
    );
  }

  return new IronTimerResponse("Solve updated", updatedSolve);
}

export async function deleteAll(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  await SolveDAL.deleteAll(uid);

  Logger.logToDb("user_solves_deleted", "", uid);

  return new IronTimerResponse("All solves deleted");
}

export async function deleteSolve(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { id } = req.params;

  await SolveDAL.deleteSolve(uid, id);

  Logger.logToDb("user_solve_deleted", "", uid);

  return new IronTimerResponse("Solve deleted");
}

export async function addSolve(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const user = await getUser(uid, "add solve");

  const solve: Solve = Object.assign({}, req.body.solve);

  const session = await SessionDAL.getSession(uid, solve.sessionId);

  if (session === undefined) {
    throw new IronTimerError(
      IronTimerStatusCodes.SESSION_NOT_FOUND.code,
      IronTimerStatusCodes.SESSION_NOT_FOUND.message
    );
  }

  solve.uid = uid;

  if (isSolveTooFast(solve, session)) {
    const status = IronTimerStatusCodes.SOLVE_TOO_FAST;
    throw new IronTimerError(status.code, status.message);
  }

  // Convert solve time to miliseconds
  const timeMilliseconds = solve.time * 1000;

  // Get latest solve's timestamp
  const lastSolveTimestamp = (
    await SolveDAL.getLastSolve(uid).catch(() => undefined)
  )?.createdAt.getTime();

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
      uid
    );

    const status = IronTimerStatusCodes.SOLVE_SPACING_INVALId;

    throw new IronTimerError(status.code, "Invalid solve spacing");
  }

  const isPersonalBest = await checkIfPersonalBest(uid, user, solve);

  if (isPersonalBest) {
    solve.isPersonalBest = true;
  }

  if (session.scrambleType === ScrambleType.cube3) {
    incrementCubes(uid, solve);

    if (isPersonalBest && user.discordUserId) {
      Bot.updateDiscordRole(user.discordUserId, actualTime(solve));
    }
  }

  // if (solve.challenge && user.discordUserId) {
  //   Bot.awardChallenge(user.discordUserId, solve.challenge);
  // } else {
  //   delete solve.challenge;
  // }

  updateTypingStats(uid, solve.time);
  PublicStatsDAL.updateStats(solve.time);

  const addedSolveId = await SolveDAL.addSolve(uid, solve);

  if (isPersonalBest) {
    Logger.logToDb(
      "user_new_pb",
      `${session.scrambleType} ${actualTime(solve)} ${
        solve.scramble
      } (${addedSolveId})`,
      uid
    );
  }

  const solveCreationResult: SolveCreationResult = {
    isPersonalBest,
    username: user.username,
    insertedId: addedSolveId
  };

  incrementSolve(solve);

  return new IronTimerResponse("Solve saved", solveCreationResult);
}
