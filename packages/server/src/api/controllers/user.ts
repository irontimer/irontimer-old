import admin from "firebase-admin";
import type { Request, ScrambleType } from "utils";
import * as UserDAL from "../../dal/user";
import * as Bot from "../../tasks/bot";
import { linkAccount } from "../../utils/discord";
import IronTimerError from "../../utils/error";
import { IronTimerResponse } from "../../utils/irontimer-response";
import Logger from "../../utils/logger";
import { buildAgentLog } from "../../utils/misc";
import { isUsernameValid } from "../../utils/validation";

export async function getUser(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(userID, "get user").catch(async () => {
    await admin.auth().deleteUser(userID);

    throw new IronTimerError(
      404,
      "User not found. Please try to sign up again.",
      "get user",
      userID
    );
  });

  const agentLog = buildAgentLog(req);
  Logger.logToDb("user_data_requested", agentLog, userID);

  return new IronTimerResponse("User data retrieved", userInfo);
}

export async function createNewUser(req: Request): Promise<IronTimerResponse> {
  const { username } = req.body;
  const { email, userID } = req.ctx.decodedToken;

  const available = await UserDAL.isNameAvailable(username);

  if (!available) {
    throw new IronTimerError(409, "Username unavailable");
  }

  await UserDAL.addUser(username, email, userID);

  Logger.logToDb("user_created", `${username} ${email}`, userID);

  return new IronTimerResponse("User created");
}

export async function updateName(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { name } = req.body;

  const oldUser = await UserDAL.getUser(userID, "update name");

  await UserDAL.updateName(userID, name);

  Logger.logToDb(
    "user_name_updated",
    `changed name from ${oldUser.username} to ${name}`,
    userID
  );

  return new IronTimerResponse("User's name updated");
}

export async function clearPersonalBests(
  req: Request
): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  await UserDAL.clearPersonalBests(userID);

  Logger.logToDb("user_cleared_pbs", "", userID);

  return new IronTimerResponse("User's Personal Bests cleared");
}

export async function checkName(req: Request): Promise<IronTimerResponse> {
  const { name } = req.params;

  const available = await UserDAL.isNameAvailable(name);

  if (!available) {
    throw new IronTimerError(409, "Username unavailable");
  }

  const valid = isUsernameValid(name);

  if (!valid) {
    throw new IronTimerError(
      400,
      "Username invalid. Name cannot use special characters or contain more than 16 characters. Can include _ . and -"
    );
  }

  return new IronTimerResponse("Username available");
}

export async function updateEmail(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { newEmail } = req.body;

  await UserDAL.updateEmail(userID, newEmail).catch((e) => {
    throw new IronTimerError(404, e.message, "update email", userID);
  });

  Logger.logToDb("user_email_updated", `changed email to ${newEmail}`, userID);

  return new IronTimerResponse("Email updated");
}

export async function linkDiscord(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const {
    data: { tokenType, accessToken }
  } = req.body;

  const userInfo = await UserDAL.getUser(userID, "link discord");

  if (userInfo.discordUserID !== undefined) {
    throw new IronTimerError(
      409,
      "This account is already linked to a Discord account"
    );
  }

  const { id: discordUserID } = await linkAccount(tokenType, accessToken);

  if (!discordUserID) {
    throw new IronTimerError(
      500,
      "Could not get Discord account info",
      "discord id is undefined"
    );
  }

  const discordUserIDAvailable = await UserDAL.isDiscordUserIDAvailable(
    discordUserID
  );

  if (!discordUserIDAvailable) {
    throw new IronTimerError(
      409,
      "This Discord account is linked to a different account"
    );
  }

  await UserDAL.linkDiscord(userID, discordUserID);
  await Bot.linkDiscord(discordUserID, userID);

  Logger.logToDb("user_discord_link", `linked to ${discordUserID}`, userID);

  return new IronTimerResponse("Discord account linked", discordUserID);
}

export async function unlinkDiscord(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(userID, "unlink discord");

  if (!userInfo.discordUserID) {
    throw new IronTimerError(
      404,
      "User does not have a linked Discord account"
    );
  }

  await UserDAL.unlinkDiscord(userID);
  await Bot.unlinkDiscord(userInfo.discordUserID, userID);

  Logger.logToDb("user_discord_unlinked", userInfo.discordUserID, userID);

  return new IronTimerResponse("Discord account unlinked");
}

export async function getCustomThemes(
  req: Request
): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const customThemes = await UserDAL.getThemes(userID);

  return new IronTimerResponse("Custom themes retrieved", customThemes);
}

export async function addCustomTheme(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { name, colors } = req.body;

  const addedTheme = await UserDAL.addTheme(userID, { name, colors });

  return new IronTimerResponse("Custom theme added", addedTheme);
}

export async function removeCustomTheme(
  req: Request
): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { themeID } = req.body;

  await UserDAL.removeTheme(userID, themeID);

  return new IronTimerResponse("Custom theme removed");
}

export async function editCustomTheme(
  req: Request
): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { themeID, theme } = req.body;

  await UserDAL.editTheme(userID, themeID, theme);

  return new IronTimerResponse("Custom theme updated");
}

export async function getPersonalBests(
  req: Request
): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { scrambleType } = req.query;

  const personalBests = await UserDAL.getPersonalBests(
    userID,
    scrambleType as ScrambleType
  );

  return new IronTimerResponse("Personal bests retrieved", personalBests);
}

export async function getStats(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const stats = await UserDAL.getStats(userID);

  return new IronTimerResponse("Personal stats retrieved", stats);
}

export async function deleteUser(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(userID, "delete user");

  await UserDAL.deleteUser(userID);

  Logger.logToDb(
    "user_deleted",
    `${userInfo.email} ${userInfo.username}`,
    userID
  );

  return new IronTimerResponse("User deleted");
}
