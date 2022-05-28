import { Client, Endpoints, EndpointData } from "../../../types";

const BASE_PATH = "/api-keys";

export default function getApiKeysEndpoints(
  apiClient: Client
): Endpoints["apiKeys"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function generate(name: string, enabled: boolean): EndpointData {
    const payload = { name, enabled };
    return await apiClient.post(BASE_PATH, { payload });
  }

  async function update(
    apiKeyID: string,
    updates: { name?: string; enabled?: boolean }
  ): EndpointData {
    const payload = { ...updates };
    return await apiClient.patch(`${BASE_PATH}/${apiKeyID}`, { payload });
  }

  async function _delete(apiKeyID: string): EndpointData {
    return await apiClient.delete(`${BASE_PATH}/${apiKeyID}`);
  }

  return {
    get,
    generate,
    update,
    delete: _delete
  };
}
