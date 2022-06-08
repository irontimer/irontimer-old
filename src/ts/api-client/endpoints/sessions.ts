import { HttpClient, EndpointData, Session } from "../../../types";

const BASE_PATH = "/sessions";

export default class Sessions {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData {
    return await this.httpClient.get(BASE_PATH);
  }

  async add(session: Session): EndpointData {
    return await this.httpClient.post(BASE_PATH, {
      payload: { session }
    });
  }

  async deleteAll(): EndpointData {
    return await this.httpClient.delete(BASE_PATH);
  }

  async delete(): EndpointData {
    return await this.httpClient.delete(BASE_PATH);
  }
}
