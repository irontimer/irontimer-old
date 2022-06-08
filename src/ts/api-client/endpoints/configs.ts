import { HttpClient, EndpointData, Saved, Config } from "../../../types";
import { strip } from "../strip";

const BASE_PATH = "/configs";

export default class Configs {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData {
    return await this.httpClient.get(BASE_PATH);
  }

  async save(config: Config | Saved<Config, string>): EndpointData {
    const strippedConfig = strip(config);

    return await this.httpClient.patch(BASE_PATH, {
      payload: { config: strippedConfig }
    });
  }
}
