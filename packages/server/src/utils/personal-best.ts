import _ from "lodash";
import { PersonalBest, Solve } from "utils";
import { actualTime } from "./misc";

export function checkAndUpdatePersonalBest(
  userPersonalBests: PersonalBest[],
  solve: Solve
): {
  isPersonalBest: boolean;
  personalBests: PersonalBest[];
} {
  const personalBestMatch = findMatchingPersonalBest(userPersonalBests, solve);

  let isPersonalBest = false;

  if (personalBestMatch !== undefined) {
    if (actualTime(solve) >= personalBestMatch.time) {
      isPersonalBest = false;
    } else {
      const updatedPersonalBest = buildPersonalBest(solve);

      userPersonalBests[userPersonalBests.indexOf(personalBestMatch)] =
        updatedPersonalBest;

      isPersonalBest = true;
    }
  } else {
    userPersonalBests.push(buildPersonalBest(solve));
  }

  return {
    isPersonalBest: isPersonalBest,
    personalBests: userPersonalBests
  };
}

export function findMatchingPersonalBest(
  personalBests: PersonalBest[],
  solve: Solve
): PersonalBest | undefined {
  return personalBests.find((pb) => matchesPersonalBest(solve, pb));
}

function matchesPersonalBest(
  solve: Solve,
  personalBest: PersonalBest
): boolean {
  return _.isEqual(buildPersonalBest(solve), personalBest);
}

function buildPersonalBest(solve: Solve): PersonalBest {
  return {
    time: actualTime(solve),
    scramble: solve.scramble,
    sessionId: solve.sessionId,
    solution: solve.solution,
    createdAt: solve.createdAt
  };
}
