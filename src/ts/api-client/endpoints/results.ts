import { HttpClient, EndpointData, Result, Saved } from "../../../types";
import { strip } from "../strip";
import { CLIENT_VERSION } from "../../version";

const BASE_PATH = "/results";

export default class Results {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData {
    return await this.httpClient.get(BASE_PATH);
  }

  async save(result: Result): EndpointData {
    return await this.httpClient.post(BASE_PATH, {
      payload: { result },
      headers: { "Client-Version": CLIENT_VERSION }
    });
  }

  async update(result: Saved<Result>): EndpointData {
    const strippedResult = strip(result);

    return await this.httpClient.patch(`${BASE_PATH}/${result._id}`, {
      payload: { result: strippedResult }
    });
  }

  async delete(result: Saved<Result>): EndpointData {
    return await this.httpClient.delete(`${BASE_PATH}/${result._id}`);
  }

  async deleteAll(): EndpointData {
    return await this.httpClient.delete(BASE_PATH);
  }
}
