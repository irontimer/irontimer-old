import {
  HttpClient,
  EndpointData,
  ConfigChanges,
  Preset
} from "../../../types";

const BASE_PATH = "/presets";

export default class Presets {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<Preset[]> {
    return await this.httpClient.get(BASE_PATH);
  }

  async add(
    presetName: string,
    configChanges: ConfigChanges
  ): EndpointData<undefined> {
    const payload = {
      name: presetName,
      config: configChanges
    };

    return await this.httpClient.post(BASE_PATH, { payload });
  }

  async edit(
    presetID: string,
    presetName: string,
    configChanges: ConfigChanges
  ): EndpointData<undefined> {
    const payload = {
      _id: presetID,
      name: presetName,
      config: configChanges
    };

    return await this.httpClient.patch(BASE_PATH, { payload });
  }

  async delete(presetID: string): EndpointData<undefined> {
    return await this.httpClient.delete(`${BASE_PATH}/${presetID}`);
  }
}
