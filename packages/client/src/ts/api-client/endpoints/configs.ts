import { Config, EndpointData, HttpClient, Saved } from "utils";
import { strip } from "../strip";

const BASE_PATH = "/configs";

export default class Configs {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<Saved<Config, string>> {
    return await this.httpClient.get(BASE_PATH);
  }

  async save(config: Config | Saved<Config, string>): EndpointData<undefined> {
    const strippedConfig = strip(config);

    return await this.httpClient.patch(BASE_PATH, {
      payload: { config: strippedConfig }
    });
  }
}
