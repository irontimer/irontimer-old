import _ from "lodash";
import { PersonalBest, SavedResult } from "../../types";

interface CheckAndUpdatePersonalBestResult {
  isPersonalBest: boolean;
  personalBests: PersonalBest[];
}

export function checkAndUpdatePersonalBest(
  userPersonalBests: PersonalBest[],
  result: SavedResult
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
  result: SavedResult
): PersonalBest | undefined {
  return personalBests.find((pb) => matchesPersonalBest(result, pb));
}

function matchesPersonalBest(
  result: SavedResult,
  personalBest: PersonalBest
): boolean {
  return _.isEqual(buildPersonalBest(result), personalBest);
}

function buildPersonalBest(result: SavedResult): PersonalBest {
  return {
    time: result.time,
    timestamp: result.timestamp,
    scramble: result.scramble,
    scrambleType: result.scrambleType,
    solution: result.solution
  };
}
