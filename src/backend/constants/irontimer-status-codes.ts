import _ from "lodash";

interface Status {
  code: number;
  message: string;
}

interface Statuses {
  RESULT_TOO_FAST: Status;
  SESSION_NOT_FOUND: Status;
  RESULT_HASH_INVALID: Status;
  RESULT_DATA_INVALID: Status;
  RESULT_SPACING_INVALID: Status;
  MISSING_KEY_DATA: Status;
  BOT_DETECTED: Status;
  GIT_GUD: Status;
  API_KEY_INVALID: Status;
  API_KEY_INACTIVE: Status;
  API_KEY_MALFORMED: Status;
}

const statuses: Statuses = {
  RESULT_TOO_FAST: {
    code: 460,
    message: "Solve is too fast"
  },
  SESSION_NOT_FOUND: {
    code: 461,
    message: "Session not found"
  },
  RESULT_HASH_INVALID: {
    code: 461,
    message: "Result hash invalid"
  },
  RESULT_SPACING_INVALID: {
    code: 462,
    message: "Result spacing invalid"
  },
  RESULT_DATA_INVALID: {
    code: 463,
    message: "Result data invalid"
  },
  MISSING_KEY_DATA: {
    code: 464,
    message: "Missing key data"
  },
  BOT_DETECTED: {
    code: 465,
    message: "Bot detected"
  },
  GIT_GUD: {
    code: 469,
    message: "Git gud scrub"
  },
  API_KEY_INVALID: {
    code: 470,
    message: "Invalid ApiKey"
  },
  API_KEY_INACTIVE: {
    code: 471,
    message: "ApiKey is inactive"
  },
  API_KEY_MALFORMED: {
    code: 472,
    message: "ApiKey is malformed"
  }
};

const CUSTOM_STATUS_CODES = new Set(
  _.map(statuses, (status: Status) => status.code)
);

export function isCustomCode(code: number): boolean {
  return CUSTOM_STATUS_CODES.has(code);
}

export default statuses;
