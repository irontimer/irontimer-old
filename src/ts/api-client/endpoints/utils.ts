import { HttpClient, EndpointData } from "../../../types";

const BASE_PATH = "/";

interface Ping {
  uptime: number;
  version: string;
}

export default class Utils {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async ping(): EndpointData<Ping> {
    return await this.httpClient.get(BASE_PATH);
  }
}
