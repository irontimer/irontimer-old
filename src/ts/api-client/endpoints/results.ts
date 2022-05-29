import {
  Client,
  Endpoints,
  EndpointData,
  Result,
  AlmostSaved,
  Saved
} from "../../../types";
import { CLIENT_VERSION } from "../../version";

const BASE_PATH = "/results";

export default function getResultsEndpoints(
  apiClient: Client
): Endpoints["results"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function save(result: AlmostSaved<Result>): EndpointData {
    return await apiClient.post(BASE_PATH, {
      payload: { result },
      headers: { "Client-Version": CLIENT_VERSION }
    });
  }

  async function deleteResult(result: Saved<Result>): EndpointData {
    return await apiClient.delete(`${BASE_PATH}/${result._id}`);
  }

  async function deleteAll(): EndpointData {
    return await apiClient.delete(BASE_PATH);
  }

  return { get, save, deleteAll, delete: deleteResult };
}
