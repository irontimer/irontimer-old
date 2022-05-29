// import { Response, NextFunction } from "express";
import rateLimit /*, { Options }*/ from "express-rate-limit";
import IronTimerError from "../utils/error";
import { Request } from "../../types";

const REQUEST_MULTIPLIER = process.env.MODE === "dev" ? 100 : 1;

const getAddress = (req: Request /*, _res: Response*/): string => {
  return (req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.ip ||
    "255.255.255.255") as string;
};

const customHandler = (/*_req: Request,
  _res: Response,
  _next: NextFunction,
  _options: Options*/): void => {
  throw new IronTimerError(429, "Too many attempts, please try again later.");
};

const ONE_HOUR = 1000 * 60 * 60;

// Config Routing
export const configUpdate = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const configGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 120 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

// Presets Routing
export const presetsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const presetsAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const presetsRemove = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const presetsEdit = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

// PSA (Public Service Announcement) Routing
export const psaGet = rateLimit({
  windowMs: 60 * 1000,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

// Results Routing
export const resultsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const resultsAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 500 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const resultsDeleteAll = rateLimit({
  windowMs: ONE_HOUR,
  max: 10 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const resultsDelete = rateLimit({
  windowMs: ONE_HOUR,
  max: 100 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

// Sessions Routing
export const sessionsGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const sessionsAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const sessionsDeleteAll = rateLimit({
  windowMs: ONE_HOUR,
  max: 10 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const sessionsDelete = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

// Users Routing
export const userGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userSignup = rateLimit({
  windowMs: 24 * ONE_HOUR, // 1 day
  max: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userDelete = rateLimit({
  windowMs: 24 * ONE_HOUR, // 1 day
  max: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userCheckName = rateLimit({
  windowMs: 60 * 1000,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userUpdateName = rateLimit({
  windowMs: 24 * ONE_HOUR, // 1 day
  max: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userUpdateEmail = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userClearPB = rateLimit({
  windowMs: ONE_HOUR,
  max: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userCustomThemeGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userCustomThemeAdd = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userCustomThemeRemove = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userCustomThemeEdit = rateLimit({
  windowMs: ONE_HOUR,
  max: 30 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userDiscordLink = rateLimit({
  windowMs: ONE_HOUR,
  max: 15 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const userDiscordUnlink = rateLimit({
  windowMs: ONE_HOUR,
  max: 15 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

// ApiKeys Routing
export const apiKeysGet = rateLimit({
  windowMs: ONE_HOUR,
  max: 120 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const apiKeysGenerate = rateLimit({
  windowMs: ONE_HOUR,
  max: 15 * REQUEST_MULTIPLIER,
  keyGenerator: getAddress,
  handler: customHandler
});

export const apiKeysUpdate = apiKeysGenerate;

export const apiKeysDelete = apiKeysGenerate;
