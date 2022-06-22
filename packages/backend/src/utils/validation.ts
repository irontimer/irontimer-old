import _ from "lodash";
import {
  Solve,
  Saved,
  Session,
  MINIMUM_NECESSARY_TIME
} from "@irontimer/utils";
import profanities from "../constants/profanities";

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

const VALID_NAME_PATTERN = /^[\da-zA-Z_.-]+$/;

export function isUsernameValid(name: string): boolean {
  if (_.isNil(name) || !inRange(name.length, 1, 16)) {
    return false;
  }

  const normalizedName = name.toLowerCase();

  const beginsWithPeriod = /^\..*/.test(normalizedName);
  if (beginsWithPeriod) {
    return false;
  }

  const isProfanity = profanities.find((profanity) =>
    normalizedName.includes(profanity)
  );
  if (isProfanity) {
    return false;
  }

  return VALID_NAME_PATTERN.test(name);
}

export function isPresetNameValid(name: string): boolean {
  if (_.isNil(name) || !inRange(name.length, 1, 16)) {
    return false;
  }

  return VALID_NAME_PATTERN.test(name);
}

export function isSolveTooFast(
  solve: Saved<Solve>,
  session: Saved<Session> | Session
): boolean {
  return solve.time < MINIMUM_NECESSARY_TIME[session.scrambleType];
}
