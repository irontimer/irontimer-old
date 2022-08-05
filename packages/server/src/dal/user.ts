import type { PersonalBest, Solve, Theme, User } from "utils";
import prisma from "../init/db";
import { updateUserEmail } from "../utils/auth";
import IronTimerError from "../utils/error";
import { actualTime } from "../utils/misc";
import { checkAndUpdatePersonalBest } from "../utils/personal-best";
import { isUsernameValid } from "../utils/validation";

export async function addUser(
  username: string,
  email: string,
  uid: string
): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: uid } });

  if (user !== null) {
    throw new IronTimerError(409, "User document already exists", "addUser");
  }

  return (
    await prisma.user.create({
      data: {
        id: uid,
        username,
        email
      }
    })
  ).id;
}

export async function deleteUser(uid: string): Promise<User> {
  return await prisma.user.delete({ where: { id: uid } });
}

const DAY_IN_SECONDS = 24 * 60 * 60;
const THIRTY_DAYS_IN_SECONDS = DAY_IN_SECONDS * 30;

export async function updateName(uid: string, name: string): Promise<User> {
  if (!isUsernameValid(name)) {
    throw new IronTimerError(400, "Invalid username");
  }

  if (!(await isNameAvailable(name))) {
    throw new IronTimerError(409, "Username unavailable", name);
  }

  const user = await getUser(uid, "update name");

  if (Date.now() - user.lastNameChange.getTime() < THIRTY_DAYS_IN_SECONDS) {
    throw new IronTimerError(
      409,
      "You can change your name once every 30 days"
    );
  }

  return await prisma.user.update({
    where: { id: uid },
    data: {
      username: name,
      lastNameChange: new Date(Date.now())
    }
  });
}

export async function clearPersonalBests(uid: string): Promise<User> {
  return await prisma.user.update({
    where: { id: uid },
    data: {
      personalBests: []
    }
  });
}

export async function isNameAvailable(username: string): Promise<boolean> {
  const nameDocs = await prisma.user.findUnique({ where: { username } });

  return nameDocs === null;
}

export async function updateEmail(
  uid: string,
  email: string
): Promise<boolean> {
  await getUser(uid, "update email"); // To make sure that the user exists

  await updateUserEmail(uid, email);

  await prisma.user.update({ where: { id: uid }, data: { email } });

  return true;
}

export async function getUser(uid: string, stack: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: uid }
  });

  if (!user) {
    throw new IronTimerError(404, "User not found", stack);
  }

  return user;
}

export async function isDiscordUserIdAvailable(
  discordUserId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { discordUserId } });

  return user === null;
}

export async function checkIfPersonalBest(
  uid: string,
  user: User,
  solve: Solve
): Promise<boolean> {
  const pb = checkAndUpdatePersonalBest(user.personalBests ?? [], solve);

  if (!pb.isPersonalBest) {
    return false;
  }

  await prisma.user.update({
    where: { id: uid },
    data: { personalBests: pb.personalBests }
  });

  return true;
}

export async function resetPersonalBests(uid: string): Promise<User> {
  await getUser(uid, "reset pb");

  return await prisma.user.update({
    where: { id: uid },
    data: { personalBests: [] }
  });
}

export async function updateTypingStats(
  uid: string,
  timeSolving: number
): Promise<User> {
  return await prisma.user.update({
    where: { id: uid },
    data: {
      solveCount: {
        increment: 1
      },
      timeSolving: {
        increment: timeSolving
      }
    }
  });
}

export async function linkDiscord(
  uid: string,
  discordUserId: string
): Promise<User> {
  await getUser(uid, "link discord");

  return await prisma.user.update({
    where: { id: uid },
    data: { discordUserId }
  });
}

export async function unlinkDiscord(uid: string): Promise<User> {
  await getUser(uid, "unlink discord");

  return await prisma.user.update({
    where: { id: uid },
    data: { discordUserId: null }
  });
}

export async function incrementCubes(
  uid: string,
  solve: Solve
): Promise<User | undefined> {
  const user = await getUser(uid, "increment cubes");

  const personalBest = user.personalBests
    .filter((pb) => pb.sessionId === solve.sessionId)
    .sort((a, b) => b.time - a.time)[0];

  if (
    personalBest === undefined ||
    actualTime(solve) >= personalBest.time * 0.75
  ) {
    // Increment when no record found or wpm is within 25% of the record
    return await prisma.user.update({
      where: { id: uid },
      data: {
        cubes: {
          increment: 1
        }
      }
    });
  }

  return undefined;
}

export function themeDoesNotExist(
  customThemes: Theme[],
  name: string
): boolean {
  return (customThemes ?? []).find((t) => t.name === name) === undefined;
}

export async function addTheme(uid: string, theme: Theme): Promise<string> {
  const user = await getUser(uid, "add theme");

  if ((user.customThemes ?? []).length >= 10) {
    throw new IronTimerError(409, "Too many custom themes");
  }

  await prisma.user.update({
    where: { id: uid },
    data: {
      customThemes: {
        push: theme
      }
    }
  });

  return theme.name;
}

export async function removeTheme(uid: string, name: string): Promise<User> {
  const user = await getUser(uid, "remove theme");

  if (themeDoesNotExist(user.customThemes ?? [], name)) {
    throw new IronTimerError(404, "Custom theme not found");
  }

  return await prisma.user.update({
    where: { id: uid },
    data: {
      customThemes: {
        deleteMany: {
          where: {
            name
          }
        }
      }
    }
  });
}

export async function editTheme(
  uid: string,
  name: string,
  theme: Theme
): Promise<User> {
  const user = await getUser(uid, "edit theme");

  if (themeDoesNotExist(user.customThemes ?? [], name)) {
    throw new IronTimerError(404, "Custom Theme not found");
  }

  return await prisma.user.update({
    where: { id: uid },
    data: {
      customThemes: {
        updateMany: {
          where: {
            name: theme.name
          },
          data: {
            colors: theme.colors
          }
        }
      }
    }
  });
}

export async function getThemes(uid: string): Promise<Theme[]> {
  const user = await getUser(uid, "get themes");

  return user.customThemes ?? [];
}

export async function getPersonalBests(
  uid: string,
  sessionId: string
): Promise<PersonalBest | undefined> {
  const user = await getUser(uid, "get personal bests");

  return user.personalBests.find((pb) => pb.sessionId === sessionId);
}
