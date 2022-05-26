import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import endpoints from "./endpoints";
import { auth } from "../functions/auth";
import { getIdToken } from "firebase/auth";
import {
  RequestOptions,
  MethodTypes,
  ClientMethod,
  EndpointData,
  ApiResponse,
  Client,
  Endpoints
} from "../types";

const DEV_SERVER_HOST = "http://localhost:3005";
const PROD_SERVER_HOST = "http://api.irontimer.com:3005";

const API_PATH = "";
const BASE_URL =
  window.location.hostname === "localhost" ? DEV_SERVER_HOST : PROD_SERVER_HOST;
const API_URL = `${BASE_URL}${API_PATH}`;

// Adapts the api client's view of request options to the underlying HTTP client.
async function adaptRequestOptions(
  options: RequestOptions
): Promise<AxiosRequestConfig> {
  const currentUser = auth.currentUser;
  const idToken = currentUser && (await getIdToken(currentUser));

  return {
    params: options.searchQuery,
    data: options.payload,
    headers: {
      ...options.headers,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(idToken && { Authorization: `Bearer ${idToken}` })
    }
  };
}

type AxiosClientMethod = (
  endpoint: string,
  config: AxiosRequestConfig
) => Promise<AxiosResponse>;

type AxiosClientDataMethod = (
  endpoint: string,
  data: any,
  config: AxiosRequestConfig
) => Promise<AxiosResponse>;

type AxiosClientMethods = AxiosClientMethod & AxiosClientDataMethod;

// Wrap the underlying HTTP client's method with our own.
function transformClientMethod(
  clientMethod: AxiosClientMethods,
  methodType: MethodTypes
): ClientMethod {
  return async (
    endpoint: string,
    options: RequestOptions = {}
  ): EndpointData => {
    let errorMessage = "";

    try {
      const requestOptions: AxiosRequestConfig = await adaptRequestOptions(
        options
      );

      let response;
      if (methodType === "get" || methodType === "delete") {
        response = await clientMethod(endpoint, requestOptions);
      } else {
        response = await clientMethod(
          endpoint,
          requestOptions.data,
          requestOptions
        );
      }

      const { message, data } = response.data as ApiResponse;

      return {
        status: response.status,
        message,
        data
      };
    } catch (error) {
      console.error(error);

      const typedError = error as Error;
      errorMessage = typedError.message;

      if (axios.isAxiosError(typedError)) {
        return {
          status: typedError.response?.status ?? 500,
          message: typedError.message,
          ...(typedError.response?.data as any)
        };
      }
    }

    return {
      status: 500,
      message: errorMessage
    };
  };
}

const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

const apiClient: Client = {
  get: transformClientMethod(axiosClient.get, "get"),
  post: transformClientMethod(axiosClient.post, "post"),
  put: transformClientMethod(axiosClient.put, "put"),
  patch: transformClientMethod(axiosClient.patch, "patch"),
  delete: transformClientMethod(axiosClient.delete, "delete")
};

// API Endpoints
const Api: Endpoints = {
  users: endpoints.getUsersEndpoints(apiClient),
  configs: endpoints.getConfigsEndpoints(apiClient),
  results: endpoints.getResultsEndpoints(apiClient),
  psas: endpoints.getPsasEndpoints(apiClient),
  presets: endpoints.getPresetsEndpoints(apiClient),
  apiKeys: endpoints.getApiKeysEndpoints(apiClient)
};

export default Api;
