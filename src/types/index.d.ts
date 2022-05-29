/** @format */

import { ObjectId } from "mongoose";
import { Request as ExpressRequest } from "express";
import type { ScrambleType } from "../constants/scramble-type";

export type AlmostSaved<T> = T & {
  userID: string;
};
export type Saved<T, ID = ObjectId> = AlmostSaved<T> & {
  _id: ID;
};

export interface Result {
  time: number; // float seconds for how long the solve was
  timestamp: number;
  scramble: string;
  session: string;
  enteredBy: TimerType;
  solution?: string;
  isPersonalBest?: boolean;
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
  session: string;
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
  _id: string; // this is the user's uid
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

export interface Session {
  name: string;
  scrambleType: ScrambleType;
}

export interface Config {
  timerType: TimerType;
  currentSession: string;
}

export type ConfigChanges = Partial<Saved<Config, string>>;

export interface Preset {
  _id: ObjectId;
  userID: string;
  name: string;
  config: Saved<Config, string>;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
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
    save: (config: Config | Saved<Config, string>) => EndpointData;
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
    save: (result: Result & { userID: string }) => EndpointData;
    delete: (result: Saved<Result>) => EndpointData;
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

  sessions: {
    get: Endpoint;
    add: (session: Session) => EndpointData;
    delete: (session: Saved<Session>) => EndpointData;
    deleteAll: Endpoint;
  };
}
