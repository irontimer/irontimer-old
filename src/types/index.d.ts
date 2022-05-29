/** @format */

import { ObjectId } from "mongoose";
import { Request as ExpressRequest } from "express";
import { ScrambleType } from "../constants/scramble-type";

export interface UnsavedResult {
  time: number; // float seconds for how long the solve was
  timestamp: number;
  scramble: string;
  scrambleType: ScrambleType;
  solution?: string;
  isPersonalBest?: boolean;
}

export interface AlmostSavedResult extends UnsavedResult {
  userID: string;
}

export interface SavedResult extends AlmostSavedResult {
  _id: ObjectId;
}

export interface AddResultResponse {
  insertedID: ObjectId;
  isPersonalBest: boolean;
  username: string;
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

export type TimerType = "timer" | "typing" | "stackmat";

export interface UnsavedConfig {
  timerType: TimerType;
  scrambleType: ScrambleType;
}

export interface AlmostSavedConfig extends UnsavedConfig {
  userID: string;
}

export interface SavedConfig extends AlmostSavedConfig {
  _id: string;
}

export type ConfigChanges = Partial<SavedConfig>;

export interface Preset {
  _id: ObjectId;
  userID: string;
  name: string;
  config: SavedConfig;
}

export interface Notification {
  status: "success" | "error" | "info";
  message: string;
}

////////////////////////////////////////////////////////////////////////////////
// API
////////////////////////////////////////////////////////////////////////////////

export type ClientMethod = (
  endpoint: string,
  config?: RequestOptions
) => Promise<Response>;

export interface ApiResponse {
  message: string;
  data: any | null;
}

export interface Client {
  get: ClientMethod;
  post: ClientMethod;
  put: ClientMethod;
  patch: ClientMethod;
  delete: ClientMethod;
}

export type MethodTypes = keyof Client;

export interface RequestOptions {
  headers?: Record<string, string>;
  searchQuery?: Record<string, any>;
  payload?: any;
}

export interface Response {
  status: number;
  message: string;
  data?: any;
}

export type EndpointData = Promise<Response>;
export type Endpoint = () => EndpointData;

export interface Endpoints {
  configs: {
    get: Endpoint;
    save: (config: UnsavedConfig | SavedConfig) => EndpointData;
  };

  presets: {
    get: Endpoint;
    add: (presetName: string, configChanges: ConfigChanges) => EndpointData;
    edit: (
      presetId: string,
      presetName: string,
      configChanges: ConfigChanges
    ) => EndpointData;
    delete: (presetId: string) => EndpointData;
  };

  psas: {
    get: Endpoint;
  };

  users: {
    getData: Endpoint;
    create: (name: string, email: string, userID: string) => EndpointData;
    getNameAvailability: (name: string) => EndpointData;
    delete: Endpoint;
    updateName: (name: string) => EndpointData;
    updateEmail: (newEmail: string, previousEmail: string) => EndpointData;
    deletePersonalBests: Endpoint;
    getCustomThemes: () => EndpointData;
    addCustomTheme: (newTheme: Partial<Theme>) => EndpointData;
    editCustomTheme: (
      themeId: string,
      newTheme: Partial<Theme>
    ) => EndpointData;
    deleteCustomTheme: (themeId: string) => EndpointData;
    linkDiscord: (data: {
      tokenType: string;
      accessToken: string;
      userID?: string;
    }) => EndpointData;
    unlinkDiscord: Endpoint;
  };

  results: {
    get: Endpoint;
    save: (result: UnsavedResult & { userID: string }) => EndpointData;
    delete: (result: SavedResult) => EndpointData;
    deleteAll: Endpoint;
  };

  apiKeys: {
    get: Endpoint;
    generate: (name: string, enabled: boolean) => EndpointData;
    update: (
      apiKeyId: string,
      updates: { name?: string; enabled?: boolean }
    ) => EndpointData;
    delete: (apiKeyId: string) => EndpointData;
  };
}
