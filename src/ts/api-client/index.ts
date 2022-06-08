import endpoints from "./endpoints";
import { buildHttpClient } from "./adapters/axios-adapter";

const DEV_SERVER_HOST = "http://localhost:3005";
const PROD_SERVER_HOST = "https://guarded-bayou-82640.herokuapp.com/"; //"https://api.irontimer.com:3005";

const API_PATH = "";
const BASE_URL =
  window.location.hostname === "localhost" ? DEV_SERVER_HOST : PROD_SERVER_HOST;
const API_URL = `${BASE_URL}${API_PATH}`;

const httpClient = buildHttpClient(API_URL, 10000);

// API Endpoints
export default {
  users: new endpoints.Users(httpClient),
  configs: new endpoints.Configs(httpClient),
  results: new endpoints.Results(httpClient),
  psas: new endpoints.Psas(httpClient),
  presets: new endpoints.Presets(httpClient),
  sessions: new endpoints.Sessions(httpClient),
  apiKeys: new endpoints.ApiKeys(httpClient)
};
