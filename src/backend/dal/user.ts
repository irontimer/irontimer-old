import type {
  PersonalBest,
  SavedResult,
  UserStats,
  Theme,
  User as IUser
} from "../../types";
import { User } from "../models/user";
import { isUsernameValid } from "../utils/validation";
import { updateUserEmail } from "../utils/auth";
import { checkAndUpdatePersonalBest as checkAndUpdatePersonalBest } from "../utils/personal-best";
import IronTimerError from "../utils/error";
import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { ScrambleType } from "../../constants/scramble-type";

export async function addUser(
  username: string,
  email: string,
  userID: string
): Promise<InsertOneResult<IUser>> {
  const user = await User.findOne({ _id: userID });

  if (user !== null) {
    throw new IronTimerError(409, "User document already exists", "addUser");
  }

  const newUser = await User.create({
    _id: userID,
    username,
    email,
    addedAt: Date.now(),
    personalBests: [],
    canManageApiKeys: false,
    timeCubing: 0,
    resultCount: 0,
    lastNameChange: null,
    customThemes: []
  });

  return {
    acknowledged: true,
    insertedID: newUser._id
  };
}

export async function deleteUser(userID: string): Promise<DeleteResult> {
  return await User.deleteOne({ _id: userID });
}

const DAY_IN_SECONDS = 24 * 60 * 60;
const THIRTY_DAYS_IN_SECONDS = DAY_IN_SECONDS * 30;

export async function updateName(
  userID: string,
  name: string
): Promise<UpdateResult> {
  if (!isUsernameValid(name)) {
    throw new IronTimerError(400, "Invalid username");
  }

  if (!(await isNameAvailable(name))) {
    throw new IronTimerError(409, "Username unavailable", name);
  }

  const user = await getUser(userID, "update name");

  if (Date.now() - (user.lastNameChange ?? 0) < THIRTY_DAYS_IN_SECONDS) {
    throw new IronTimerError(
      409,
      "You can change your name once every 30 days"
    );
  }

  return await User.updateOne(
    { _id: userID },
    {
      $set: { name, lastNameChange: Date.now() },
      $unset: { needsToChangeName: "" }
    }
  );
}

export async function clearPersonalBest(userID: string): Promise<UpdateResult> {
  return await User.updateOne(
    { _id: userID },
    {
      $set: {
        personalBests: []
      }
    }
  );
}

export async function isNameAvailable(username: string): Promise<boolean> {
  const nameDocs = await User.find({ username })
    .collation({ locale: "en", strength: 1 })
    .limit(1);

  return nameDocs.length === 0;
}

export async function updateEmail(
  userID: string,
  email: string
): Promise<boolean> {
  await getUser(userID, "update email"); // To make sure that the user exists
  await updateUserEmail(userID, email);
  await User.updateOne({ _id: userID }, { $set: { email } });
  return true;
}

export async function getUser(userID: string, stack: string): Promise<IUser> {
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new IronTimerError(404, "User not found", stack);
  }
  return user;
}

export async function isDiscordUserIDAvailable(
  discordUserID: string
): Promise<boolean> {
  const user = await User.findOne({ discordUserID });

  return user === null;
}

export async function checkIfPersonalBest(
  userID: string,
  user: IUser,
  result: SavedResult
): Promise<boolean> {
  const pb = checkAndUpdatePersonalBest(user.personalBests ?? [], result);

  if (!pb.isPersonalBest) {
    return false;
  }

  await User.updateOne(
    { _id: userID },
    { $set: { personalBests: pb.personalBests } }
  );

  return true;
}

export async function resetPersonalBests(
  userID: string
): Promise<UpdateResult> {
  await getUser(userID, "reset pb");
  return await User.updateOne(
    { _id: userID },
    {
      $set: {
        personalBests: []
      }
    }
  );
}

export async function updateTypingStats(
  userID: string,
  timeCubing: number
): Promise<UpdateResult> {
  return await User.updateOne(
    { _id: userID },
    {
      $inc: {
        resultCount: 1,
        timeCubing
      }
    }
  );
}

export async function linkDiscord(
  userID: string,
  discordUserID: string
): Promise<UpdateResult> {
  await getUser(userID, "link discord");

  return await User.updateOne({ _id: userID }, { $set: { discordUserID } });
}

export async function unlinkDiscord(userID: string): Promise<UpdateResult> {
  await getUser(userID, "unlink discord");

  return await User.updateOne(
    { _id: userID },
    { $set: { discordUserID: undefined } }
  );
}

export async function incrementCubes(
  userID: string,
  result: SavedResult
): Promise<UpdateResult | undefined> {
  const user = await getUser(userID, "increment cubes");

  const personalBest = user.personalBests
    .filter((pb) => pb.scrambleType === result.scrambleType)
    .sort((a, b) => b.time - a.time)[0];

  if (personalBest === undefined || result.time >= personalBest.time * 0.75) {
    // Increment when no record found or wpm is within 25% of the record
    return await User.updateOne({ _id: userID }, { $inc: { cubes: 1 } });
  }

  return undefined;
}

export function themeDoesNotExist(
  customThemes: Theme[],
  name: string
): boolean {
  return (customThemes ?? []).find((t) => t.name === name) === undefined;
}

export async function addTheme(userID: string, theme: Theme): Promise<string> {
  const user = await getUser(userID, "add theme");

  if ((user.customThemes ?? []).length >= 10) {
    throw new IronTimerError(409, "Too many custom themes");
  }

  await User.updateOne(
    { _id: userID },
    {
      $push: {
        customThemes: theme
      }
    }
  );

  return theme.name;
}

export async function removeTheme(
  userID: string,
  name: string
): Promise<UpdateResult> {
  const user = await getUser(userID, "remove theme");

  if (themeDoesNotExist(user.customThemes ?? [], name)) {
    throw new IronTimerError(404, "Custom theme not found");
  }

  return await User.updateOne(
    {
      _id: userID,
      "customThemes.name": name
    },
    { $pull: { customThemes: { name } } }
  );
}

export async function editTheme(
  userID: string,
  name: string,
  theme: Theme
): Promise<UpdateResult> {
  const user = await getUser(userID, "edit theme");

  if (themeDoesNotExist(user.customThemes ?? [], name)) {
    throw new IronTimerError(404, "Custom Theme not found");
  }

  return await User.updateOne(
    {
      _id: userID,
      "customThemes.name": name
    },
    {
      $set: {
        "customThemes.$.colors": theme.colors
      }
    }
  );
}

export async function getThemes(userID: string): Promise<Theme[]> {
  const user = await getUser(userID, "get themes");

  return user.customThemes ?? [];
}

export async function getPersonalBests(
  userID: string,
  scrambleType: ScrambleType
): Promise<PersonalBest | undefined> {
  const user = await getUser(userID, "get personal bests");

  return user.personalBests.find((pb) => pb.scrambleType === scrambleType);
}

export async function getStats(userID: string): Promise<UserStats> {
  const user = await getUser(userID, "get stats");

  return {
    resultCount: user.resultCount,
    timeCubing: user.timeCubing
  };
}
