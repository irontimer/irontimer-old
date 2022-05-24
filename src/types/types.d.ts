/** @format */

import { ObjectId } from "mongoose";
import { Request as ExpressRequest } from "express";
import { ScrambleType } from "../constants/scramble-type";

export interface Result {
  _id: ObjectId;
  userID: string;
  time: number; // float seconds for how long the solve was
  timestamp: number;
  scramble: string;
  scrambleType: ScrambleType;
  solution?: string;
}

export interface PersonalBest {
  time: number;
  timestamp: number;
  scramble: string;
  scrambleType: ScrambleType;
  solution?: string;
}

export interface Theme {
  name: string;
  colors: {
    main: string;
    sub: string;
    text: string;
  };
}

export interface User {
  _id: ObjectId;
  userID: string;
  email: string;
  username: string;
  discordUserID?: string;
  personalBests: PersonalBest[];
  canManageApiKeys: boolean;
  timeCubing: number;
  resultCount: number;
  lastNameChange?: number;
  customThemes?: Theme[];
}

export interface Configuration {
  maintenance: boolean;
  apiKeys: {
    endpointsEnabled: boolean;
    acceptKeys: boolean;
    maxKeysPerUser: number;
    apiKeyBytes: number;
    apiKeySaltRounds: number;
  };
  enableSavingResults: {
    enabled: boolean;
  };
}

export interface Log {
  timestamp: number;
  userID?: string;
  event: string;
  message: string;
}

export interface DecodedToken {
  type: "Bearer" | "ApiKey" | "None";
  userID: string;
  email: string;
}

export interface Context {
  configuration: Configuration;
  decodedToken: DecodedToken;
}

export interface Request extends ExpressRequest {
  ctx: Readonly<Context>;
}

declare module "express-serve-static-core" {
  interface Request {
    ctx: Readonly<Context>;
  }
}

export interface ApiKey {
  _id: ObjectId;
  userID: string;
  name: string;
  hash: string;
  createdOn: number;
  modifiedOn: number;
  lastUsedOn: number;
  useCount: number;
  enabled: boolean;
}

export interface PSA {
  _id: ObjectId;
  sticky?: boolean;
  message: string;
  level?: number;
}

export interface PublicStats {
  _id: ObjectId;
  resultCount: number;
  timeCubing: number;
  type: string;
}

export interface UserStats {
  resultCount: number;
  timeCubing: number;
}

export interface Config {
  _id: ObjectId;
  timerType: "timer" | "typing" | "stackmat";
  scrambleType: "3x3x3";
}

export interface Preset {
  _id: ObjectId;
  userID: string;
  name: string;
  config: Config;
}
