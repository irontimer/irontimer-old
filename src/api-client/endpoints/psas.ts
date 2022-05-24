import { Client, Endpoints, EndpointData } from "../../types/types";
import { CLIENT_VERSION } from "../../version";

const BASE_PATH = "/psas";

export default function getPsasEndpoints(apiClient: Client): Endpoints["psas"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH, {
      headers: {
        "Client-Version": CLIENT_VERSION
      }
    });
  }

  return { get };
}
