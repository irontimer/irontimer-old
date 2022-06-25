import _ from "lodash";
import { PersonalBest, Solve, Saved } from "@irontimer/utils";
import { actualTime } from "./misc";

export function checkAndUpdatePersonalBest(
  userPersonalBests: PersonalBest[],
  solve: Saved<Solve>
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
  solve: Saved<Solve>
): PersonalBest | undefined {
  return personalBests.find((pb) => matchesPersonalBest(solve, pb));
}

function matchesPersonalBest(
  solve: Saved<Solve>,
  personalBest: PersonalBest
): boolean {
  return _.isEqual(buildPersonalBest(solve), personalBest);
}

function buildPersonalBest(solve: Saved<Solve>): PersonalBest {
  return {
    time: actualTime(solve),
    timestamp: solve.timestamp,
    scramble: solve.scramble,
    session: solve.session,
    solution: solve.solution
  };
}
