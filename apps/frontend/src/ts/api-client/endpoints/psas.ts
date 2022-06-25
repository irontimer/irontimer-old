import { HttpClient, EndpointData, PSA } from "@irontimer/utils";
import { CLIENT_VERSION } from "../../version";

const BASE_PATH = "/psas";

export default class Psas {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async get(): EndpointData<PSA[]> {
    return await this.httpClient.get(BASE_PATH, {
      headers: {
        "Client-Version": CLIENT_VERSION
      }
    });
  }
}
