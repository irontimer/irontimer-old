import { HttpClient, EndpointData } from "../../../types";

const BASE_PATH = "/api-keys";

export default class ApiKeys {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData {
    return await this.httpClient.get(BASE_PATH);
  }

  async generate(name: string, enabled: boolean): EndpointData {
    const payload = { name, enabled };
    return await this.httpClient.post(BASE_PATH, { payload });
  }

  async update(
    apiKeyID: string,
    updates: { name?: string; enabled?: boolean }
  ): EndpointData {
    const payload = { ...updates };
    return await this.httpClient.patch(`${BASE_PATH}/${apiKeyID}`, { payload });
  }

  async delete(apiKeyID: string): EndpointData {
    return await this.httpClient.delete(`${BASE_PATH}/${apiKeyID}`);
  }
}
