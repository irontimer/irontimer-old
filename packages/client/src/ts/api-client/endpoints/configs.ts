import { Config, EndpointData, HttpClient } from "utils";
import { strip } from "../strip";

const BASE_PATH = "/configs";

export default class Configs {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<Config> {
    return await this.httpClient.get(BASE_PATH);
  }

  async save(config: Config): EndpointData<undefined> {
    const strippedConfig = strip(config);

    return await this.httpClient.patch(BASE_PATH, {
      payload: { config: strippedConfig }
    });
  }
}
