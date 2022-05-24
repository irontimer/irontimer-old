import * as ResultDAL from "../../dal/result";
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
import { Request } from "../../../types/types";

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

export async function deleteAll(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  await ResultDAL.deleteAll(userID);
  Logger.logToDb("user_results_deleted", "", userID);
  return new IronTimerResponse("All results deleted");
}

export async function addResult(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const user = await getUser(userID, "add result");

  const result = Object.assign({}, req.body.result);

  result.userID = userID;

  if (isResultTooFast(result)) {
    const status = IronTimerStatusCodes.TEST_TOO_SHORT;
    throw new IronTimerError(status.code, status.message);
  }

  result.name = user.username;

  //convert result test duration to miliseconds
  const durationMilliseconds = result.testDuration * 1000;
  //get latest result ordered by timestamp
  let lastResultTimestamp;
  try {
    lastResultTimestamp = (await ResultDAL.getLastResult(userID)).timestamp;
  } catch (e) {
    lastResultTimestamp = null;
  }

  result.timestamp = Math.floor(Date.now() / 1000) * 1000;

  //check if now is earlier than last result plus duration (-1 second as a buffer)
  const earliestPossible =
    (lastResultTimestamp ?? Date.now()) + durationMilliseconds;
  const nowMilliseconds = Math.floor(Date.now() / 1000) * 1000;
  if (lastResultTimestamp && nowMilliseconds < earliestPossible - 1000) {
    Logger.logToDb(
      "invalid_result_spacing",
      {
        lastTimestamp: lastResultTimestamp,
        earliestPossible,
        now: nowMilliseconds,
        testDuration: durationMilliseconds,
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

  if (result.mode === "time" && String(result.mode2) === "60") {
    incrementCubes(userID, result.wpm);
    if (isPersonalBest && user.discordUserID) {
      Bot.updateDiscordRole(user.discordUserID, result.wpm);
    }
  }

  if (result.challenge && user.discordUserID) {
    Bot.awardChallenge(user.discordUserID, result.challenge);
  } else {
    delete result.challenge;
  }

  let tt = 0;
  let afk = result.afkDuration;
  if (afk === undefined) {
    afk = 0;
  }
  tt = result.testDuration + result.incompleteTestSeconds - afk;
  updateTypingStats(userID, result.restartCount, tt);
  PublicStatsDAL.updateStats(tt);

  // if (result.bailedOut === false) {
  //   delete result.bailedOut;
  // }
  // if (result.blindMode === false) {
  //   delete result.blindMode;
  // }
  // if (result.lazyMode === false) {
  //   delete result.lazyMode;
  // }
  // if (result.difficulty === "normal") {
  //   delete result.difficulty;
  // }
  // if (result.funbox === "none") {
  //   delete result.funbox;
  // }
  // if (result.language === "english") {
  //   delete result.language;
  // }
  // if (result.numbers === false) {
  //   delete result.numbers;
  // }
  // if (result.punctuation === false) {
  //   delete result.punctuation;
  // }
  // if (result.mode !== "custom") {
  //   delete result.customText;
  // }
  // if (result.restartCount === 0) {
  //   delete result.restartCount;
  // }
  // if (result.incompleteTestSeconds === 0) {
  //   delete result.incompleteTestSeconds;
  // }
  // if (result.afkDuration === 0) {
  //   delete result.afkDuration;
  // }

  const addedResult = await ResultDAL.addResult(userID, result);

  if (isPersonalBest) {
    Logger.logToDb(
      "user_new_pb",
      `${result.mode + " " + result.mode2} ${result.wpm} ${result.acc}% ${
        result.rawWpm
      } ${result.consistency}% (${addedResult.insertedId})`,
      userID
    );
  }

  const data = {
    isPersonalBest,
    name: result.name,
    insertedId: addedResult.insertedId
  };

  incrementResult(result);

  return new IronTimerResponse("Result saved", data);
}
