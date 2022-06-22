import { auth } from "../../utils/auth";
import { getIdToken } from "firebase/auth";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  RequestOptions,
  HttpMethodTypes,
  HttpClientMethod,
  EndpointData,
  ApiResponse,
  HttpClient
} from "@irontimer/utils";

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

function transformClientMethod(
  clientMethod: AxiosClientMethods,
  methodType: HttpMethodTypes
): HttpClientMethod {
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
          ...typedError.response?.data
        };
      }
    }

    return {
      status: 500,
      message: errorMessage
    };
  };
}

export function buildHttpClient(baseURL: string, timeout: number): HttpClient {
  const axiosClient = axios.create({
    baseURL,
    timeout
  });

  return {
    get: transformClientMethod(axiosClient.get, "get"),
    post: transformClientMethod(axiosClient.post, "post"),
    put: transformClientMethod(axiosClient.put, "put"),
    patch: transformClientMethod(axiosClient.patch, "patch"),
    delete: transformClientMethod(axiosClient.delete, "delete")
  };
}
