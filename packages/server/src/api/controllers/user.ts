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
  const { uid } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(uid, "get user").catch(async () => {
    await admin.auth().deleteUser(uid);

    throw new IronTimerError(
      404,
      "User not found. Please try to sign up again.",
      "get user",
      uid
    );
  });

  const agentLog = buildAgentLog(req);
  Logger.logToDb("user_data_requested", agentLog, uid);

  return new IronTimerResponse("User data retrieved", userInfo);
}

export async function createNewUser(req: Request): Promise<IronTimerResponse> {
  const { username } = req.body;
  const { email, uid } = req.ctx.decodedToken;

  const available = await UserDAL.isNameAvailable(username);

  if (!available) {
    throw new IronTimerError(409, "Username unavailable");
  }

  await UserDAL.addUser(username, email, uid);

  Logger.logToDb("user_created", `${username} ${email}`, uid);

  return new IronTimerResponse("User created");
}

export async function updateName(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { name } = req.body;

  const oldUser = await UserDAL.getUser(uid, "update name");

  await UserDAL.updateName(uid, name);

  Logger.logToDb(
    "user_name_updated",
    `changed name from ${oldUser.username} to ${name}`,
    uid
  );

  return new IronTimerResponse("User's name updated");
}

export async function clearPersonalBests(
  req: Request
): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  await UserDAL.clearPersonalBests(uid);

  Logger.logToDb("user_cleared_pbs", "", uid);

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
  const { uid } = req.ctx.decodedToken;
  const { newEmail } = req.body;

  await UserDAL.updateEmail(uid, newEmail).catch((e) => {
    throw new IronTimerError(404, e.message, "update email", uid);
  });

  Logger.logToDb("user_email_updated", `changed email to ${newEmail}`, uid);

  return new IronTimerResponse("Email updated");
}

export async function linkDiscord(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const {
    data: { tokenType, accessToken }
  } = req.body;

  const userInfo = await UserDAL.getUser(uid, "link discord");

  if (userInfo.discordUserId !== undefined) {
    throw new IronTimerError(
      409,
      "This account is already linked to a Discord account"
    );
  }

  const { id: discordUserId } = await linkAccount(tokenType, accessToken);

  if (!discordUserId) {
    throw new IronTimerError(
      500,
      "Could not get Discord account info",
      "discord id is undefined"
    );
  }

  const discordUserIdAvailable = await UserDAL.isDiscordUserIdAvailable(
    discordUserId
  );

  if (!discordUserIdAvailable) {
    throw new IronTimerError(
      409,
      "This Discord account is linked to a different account"
    );
  }

  await UserDAL.linkDiscord(uid, discordUserId);
  await Bot.linkDiscord(discordUserId, uid);

  Logger.logToDb("user_discord_link", `linked to ${discordUserId}`, uid);

  return new IronTimerResponse("Discord account linked", discordUserId);
}

export async function unlinkDiscord(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(uid, "unlink discord");

  if (!userInfo.discordUserId) {
    throw new IronTimerError(
      404,
      "User does not have a linked Discord account"
    );
  }

  await UserDAL.unlinkDiscord(uid);
  await Bot.unlinkDiscord(userInfo.discordUserId, uid);

  Logger.logToDb("user_discord_unlinked", userInfo.discordUserId, uid);

  return new IronTimerResponse("Discord account unlinked");
}

export async function getCustomThemes(
  req: Request
): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const customThemes = await UserDAL.getThemes(uid);

  return new IronTimerResponse("Custom themes retrieved", customThemes);
}

export async function addCustomTheme(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { name, colors } = req.body;

  const addedTheme = await UserDAL.addTheme(uid, { name, colors });

  return new IronTimerResponse("Custom theme added", addedTheme);
}

export async function removeCustomTheme(
  req: Request
): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { themeId } = req.body;

  await UserDAL.removeTheme(uid, themeId);

  return new IronTimerResponse("Custom theme removed");
}

export async function editCustomTheme(
  req: Request
): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { themeId, theme } = req.body;

  await UserDAL.editTheme(uid, themeId, theme);

  return new IronTimerResponse("Custom theme updated");
}

export async function getPersonalBests(
  req: Request
): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { scrambleType } = req.query;

  const personalBests = await UserDAL.getPersonalBests(
    uid,
    scrambleType as ScrambleType
  );

  return new IronTimerResponse("Personal bests retrieved", personalBests);
}

export async function deleteUser(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(uid, "delete user");

  await UserDAL.deleteUser(uid);

  Logger.logToDb("user_deleted", `${userInfo.email} ${userInfo.username}`, uid);

  return new IronTimerResponse("User deleted");
}
