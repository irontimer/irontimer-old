import { EndpointData, HttpClient, Session } from "utils";

const BASE_PATH = "/sessions";

export default class Sessions {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<Session[]> {
    return await this.httpClient.get(BASE_PATH);
  }

  async add(session: Session): EndpointData<Session> {
    return await this.httpClient.post(BASE_PATH, {
      payload: { session }
    });
  }

  async delete(): EndpointData<undefined> {
    return await this.httpClient.delete(BASE_PATH);
  }

  async deleteAll(): EndpointData<undefined> {
    return await this.httpClient.delete(BASE_PATH);
  }
}
