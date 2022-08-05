import _ from "lodash";

interface Status {
  code: number;
  message: string;
}

interface Statuses {
  SOLVE_TOO_FAST: Status;
  SESSION_NOT_FOUND: Status;
  SOLVE_HASH_INVALId: Status;
  SOLVE_DATA_INVALId: Status;
  SOLVE_SPACING_INVALId: Status;
  MISSING_KEY_DATA: Status;
  BOT_DETECTED: Status;
  GIT_GUD: Status;
  API_KEY_INVALId: Status;
  API_KEY_INACTIVE: Status;
  API_KEY_MALFORMED: Status;
}

const statuses: Statuses = {
  SOLVE_TOO_FAST: {
    code: 460,
    message: "Solve is too fast"
  },
  SESSION_NOT_FOUND: {
    code: 461,
    message: "Session not found"
  },
  SOLVE_HASH_INVALId: {
    code: 461,
    message: "Solve hash invalid"
  },
  SOLVE_SPACING_INVALId: {
    code: 462,
    message: "Solve spacing invalid"
  },
  SOLVE_DATA_INVALId: {
    code: 463,
    message: "Solve data invalid"
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
  API_KEY_INVALId: {
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
