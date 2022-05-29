import _ from "lodash";
import { PersonalBest, Result, Saved } from "../../types";

interface CheckAndUpdatePersonalBestResult {
  isPersonalBest: boolean;
  personalBests: PersonalBest[];
}

export function checkAndUpdatePersonalBest(
  userPersonalBests: PersonalBest[],
  result: Saved<Result>
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
  result: Saved<Result>
): PersonalBest | undefined {
  return personalBests.find((pb) => matchesPersonalBest(result, pb));
}

function matchesPersonalBest(
  result: Saved<Result>,
  personalBest: PersonalBest
): boolean {
  return _.isEqual(buildPersonalBest(result), personalBest);
}

function buildPersonalBest(result: Saved<Result>): PersonalBest {
  return {
    time: result.time,
    timestamp: result.timestamp,
    scramble: result.scramble,
    session: result.session,
    solution: result.solution
  };
}
