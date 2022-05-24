import _ from "lodash";
import { PersonalBest, Result } from "../../types/types";

interface CheckAndUpdatePersonalBestResult {
  isPersonalBest: boolean;
  personalBests: PersonalBest[];
}

export function checkAndUpdatePersonalBest(
  userPersonalBests: PersonalBest[],
  result: Result
): CheckAndUpdatePersonalBestResult {
  const personalBestMatch = findMatchingPersonalBest(userPersonalBests, result);

  let isPersonalBest = false;

  if (personalBestMatch !== undefined) {
    if (result.time >= personalBestMatch.time) {
      isPersonalBest = false;
    } else {
      const updatedPersonalBest = buildPersonalBest(result);

      userPersonalBests[userPersonalBests.indexOf(personalBestMatch)] =
        updatedPersonalBest;

      isPersonalBest = true;
    }
  } else {
    userPersonalBests.push(buildPersonalBest(result));
  }

  return {
    isPersonalBest: isPersonalBest,
    personalBests: userPersonalBests
  };
}

export function findMatchingPersonalBest(
  personalBests: PersonalBest[],
  result: Result
): PersonalBest | undefined {
  return personalBests.find((pb) => matchesPersonalBest(result, pb));
}

function matchesPersonalBest(
  result: Result,
  personalBest: PersonalBest
): boolean {
  return _.isEqual(buildPersonalBest(result), personalBest);
}

function buildPersonalBest(result: Result): PersonalBest {
  return {
    time: result.time,
    timestamp: result.timestamp,
    scramble: result.scramble,
    scrambleType: result.scrambleType,
    solution: result.solution
  };
}
