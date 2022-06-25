import {
  HttpClient,
  EndpointData,
  Solve,
  Saved,
  SolveCreationResult,
  UpdateResult
} from "@irontimer/utils";
import { strip } from "../strip";

const BASE_PATH = "/solves";

export default class Solves {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<Saved<Solve>[]> {
    return await this.httpClient.get(BASE_PATH);
  }

  async getLast(): EndpointData<Saved<Solve>> {
    return await this.httpClient.get(`${BASE_PATH}/last`);
  }

  async save(solve: Solve): EndpointData<SolveCreationResult> {
    return await this.httpClient.post(BASE_PATH, {
      payload: { solve }
    });
  }

  async update(solve: Saved<Solve>): EndpointData<UpdateResult> {
    const strippedSolve = strip(solve);

    return await this.httpClient.patch(`${BASE_PATH}/${solve._id}`, {
      payload: { solve: strippedSolve }
    });
  }

  async delete(solve: Saved<Solve>): EndpointData<undefined> {
    return await this.httpClient.delete(`${BASE_PATH}/${solve._id}`);
  }

  async deleteAll(): EndpointData<undefined> {
    return await this.httpClient.delete(BASE_PATH);
  }
}
