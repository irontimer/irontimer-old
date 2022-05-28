import {
  Client,
  Endpoints,
  EndpointData,
  SavedResult,
  AlmostSavedResult
} from "../../../types";
import { CLIENT_VERSION } from "../../version";

const BASE_PATH = "/results";

export default function getResultsEndpoints(
  apiClient: Client
): Endpoints["results"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function save(result: AlmostSavedResult): EndpointData {
    return await apiClient.post(BASE_PATH, {
      payload: { result },
      headers: { "Client-Version": CLIENT_VERSION }
    });
  }

  async function deleteResult(result: SavedResult): EndpointData {
    return await apiClient.delete(`${BASE_PATH}/${result._id}`);
  }

  async function deleteAll(): EndpointData {
    return await apiClient.delete(BASE_PATH);
  }

  return { get, save, deleteAll, delete: deleteResult };
}
