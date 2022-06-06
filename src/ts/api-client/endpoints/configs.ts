import { Client, Endpoints, EndpointData, Config, Saved } from "../../../types";
import { strip } from "../strip";

const BASE_PATH = "/configs";

export default function getConfigsEndpoints(
  apiClient: Client
): Endpoints["configs"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function save(config: Config | Saved<Config, string>): EndpointData {
    const strippedConfig = strip(config);

    return await apiClient.patch(BASE_PATH, {
      payload: { config: strippedConfig }
    });
  }

  return {
    get,
    save
  };
}
