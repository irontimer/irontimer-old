import {
  HttpClient,
  EndpointData,
  Result,
  Saved,
  ResultCreationResult,
  UpdateResult
} from "../../../types";
import { strip } from "../strip";

const BASE_PATH = "/results";

export default class Results {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<Saved<Result>[]> {
    return await this.httpClient.get(BASE_PATH);
  }

  async getLast(): EndpointData<Saved<Result>> {
    return await this.httpClient.get(`${BASE_PATH}/last`);
  }

  async save(result: Result): EndpointData<ResultCreationResult> {
    return await this.httpClient.post(BASE_PATH, {
      payload: { result }
    });
  }

  async update(result: Saved<Result>): EndpointData<UpdateResult> {
    const strippedResult = strip(result);

    return await this.httpClient.patch(`${BASE_PATH}/${result._id}`, {
      payload: { result: strippedResult }
    });
  }

  async delete(result: Saved<Result>): EndpointData<undefined> {
    return await this.httpClient.delete(`${BASE_PATH}/${result._id}`);
  }

  async deleteAll(): EndpointData<undefined> {
    return await this.httpClient.delete(BASE_PATH);
  }
}
