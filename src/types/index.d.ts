export type { UpdateResult, DeleteResult } from "mongodb";
import type { Types } from "mongoose";
import type { Request as ExpressRequest } from "express";
import type { ScrambleType } from "../constants/scramble-type";

declare global {
  interface Window {
    __TAURI__?: {
      [key: string]: any;
    };
  }
}

export type AlmostSaved<T> = T & {
  userID: string;
};

export type Saved<T, ID = Types.ObjectId> = AlmostSaved<T> & {
  _id: ID;
  __v: number;
};

export interface Result {
  time: number; // float seconds for how long the solve was
  timestamp: number;
  scramble: string;
  session: string;
  enteredBy: TimerType;
  penalty: Penalty;
  solution?: string;
  isPersonalBest?: boolean;
}

export interface ResultCreationResult {
  insertedID: Types.ObjectId;
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
  _id: Types.ObjectId;
  userID: string;
  name: string;
  hash: string;
  createdOn: number;
  modifiedOn: number;
  lastUsedOn: number;
  useCount: number;
  enabled: boolean;
}

export interface GenerateApiKeyResponse {
  apiKey: string;
  apiKeyID: string;
  apiKeyDetails: Partial<ApiKey>;
}

export interface PSA {
  _id: Types.ObjectId;
  sticky?: boolean;
  message: string;
  level?: number;
}

export interface PublicStats {
  _id: Types.ObjectId;
  resultCount: number;
  timeCubing: number;
  type: string;
}

export interface UserStats {
  resultCount: number;
  timeCubing: number;
}

export type TimerType = "timer" | "typing" | "stackmat";

export type Penalty = "OK" | "+2" | "DNF";

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
  _id: Types.ObjectId;
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

export interface RequestOptions<Payload = any, QueryType = any> {
  headers?: Record<string, string>;
  searchQuery?: Record<string, QueryType>;
  payload?: Payload;
}

export interface HttpClientResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

export type EndpointData<T = any> = Promise<HttpClientResponse<T>>;

export type HttpClientMethod = (
  endpoint: string,
  config?: RequestOptions
) => Promise<HttpClientResponse>;

export interface HttpClient {
  get: HttpClientMethod;
  post: HttpClientMethod;
  put: HttpClientMethod;
  patch: HttpClientMethod;
  delete: HttpClientMethod;
}

export type HttpMethodTypes = keyof HttpClient;

export interface ApiResponse<T = any> {
  message: string;
  data: T | null;
}
