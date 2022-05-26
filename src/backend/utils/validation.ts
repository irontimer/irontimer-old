import _ from "lodash";
import type { ScrambleType } from "../../constants/scramble-type";
import { SavedResult } from "../../types";
import profanities from "../constants/profanities";

const RECORD_LIST: Record<ScrambleType, number> = {
  "3x3x3": 3.47,
  "2x2x2": 0.5
};

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

export function isResultTooFast(result: SavedResult): boolean {
  return result.time < RECORD_LIST[result.scrambleType];
}
