export * from "@prisma/client";
import type { ApiKey, Config, Configuration, Session } from "@prisma/client";
import type { Request as ExpressRequest } from "express";

declare global {
  interface Window {
    __TAURI__?: {
      [key: string]: any;
    };
  }
}

export type Unsaved<T> = Omit<T, "uid" | "id" | "createdAt" | "updatedAt">;

export interface PopulatedConfig extends Config {
  currentSession: Session;
}

export interface SolveCreationResult {
  insertedId: string;
  isPersonalBest: boolean;
  username: string;
}

export interface DecodedToken {
  type: "Bearer" | "ApiKey" | "None";
  uid: string;
  email: string;
}

export interface UserStats {
  solveCount: number;
  timeSolving: number;
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

export interface GenerateApiKeyResponse {
  apiKey: string;
  apiKeyId: string;
  apiKeyDetails: Partial<ApiKey>;
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
