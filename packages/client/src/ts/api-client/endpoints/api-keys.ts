import {
  ApiKey,
  EndpointData,
  GenerateApiKeyResponse,
  HttpClient
} from "utils";

const BASE_PATH = "/api-keys";

export default class ApiKeys {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<{ [_id: string]: Partial<ApiKey> }> {
    return await this.httpClient.get(BASE_PATH);
  }

  async generate(
    name: string,
    enabled: boolean
  ): EndpointData<GenerateApiKeyResponse> {
    const payload = { name, enabled };

    return await this.httpClient.post(BASE_PATH, { payload });
  }

  async update(
    apiKeyId: string,
    updates: { name?: string; enabled?: boolean }
  ): EndpointData<undefined> {
    return await this.httpClient.patch(`${BASE_PATH}/${apiKeyId}`, {
      payload: updates
    });
  }

  async delete(apiKeyId: string): EndpointData<undefined> {
    return await this.httpClient.delete(`${BASE_PATH}/${apiKeyId}`);
  }
}
