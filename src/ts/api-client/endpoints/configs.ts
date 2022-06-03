import { DEFAULT_CONFIG_KEYS } from "../../../constants/default-config";
import { Client, Endpoints, EndpointData, Config, Saved } from "../../../types";

const BASE_PATH = "/configs";

export default function getConfigsEndpoints(
  apiClient: Client
): Endpoints["configs"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function save(config: Config | Saved<Config, string>): EndpointData {
    const strippedConfig = Object.fromEntries(
      DEFAULT_CONFIG_KEYS.map((key) => [key, config[key]])
    );

    return await apiClient.patch(BASE_PATH, {
      payload: { config: strippedConfig }
    });
  }

  return {
    get,
    save
  };
}
