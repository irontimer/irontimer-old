import {
  Client,
  Endpoints,
  EndpointData,
  SavedConfig,
  UnsavedConfig
} from "../../types";

const BASE_PATH = "/configs";

export default function getConfigsEndpoints(
  apiClient: Client
): Endpoints["configs"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function save(config: UnsavedConfig | SavedConfig): EndpointData {
    return await apiClient.patch(BASE_PATH, { payload: { config } });
  }

  return {
    get,
    save
  };
}