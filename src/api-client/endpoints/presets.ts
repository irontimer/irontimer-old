import {
  Client,
  Endpoints,
  EndpointData,
  ConfigChanges
} from "../../types/types";

const BASE_PATH = "/presets";

export default function getPresetsEndpoints(
  apiClient: Client
): Endpoints["presets"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function add(
    presetName: string,
    configChanges: ConfigChanges
  ): EndpointData {
    const payload = {
      name: presetName,
      config: configChanges
    };

    return await apiClient.post(BASE_PATH, { payload });
  }

  async function edit(
    presetId: string,
    presetName: string,
    configChanges: ConfigChanges
  ): EndpointData {
    const payload = {
      _id: presetId,
      name: presetName,
      config: configChanges
    };

    return await apiClient.patch(BASE_PATH, { payload });
  }

  async function _delete(presetId: string): EndpointData {
    return await apiClient.delete(`${BASE_PATH}/${presetId}`);
  }

  return { get, add, edit, delete: _delete };
}
