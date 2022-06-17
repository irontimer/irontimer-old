import endpoints from "./endpoints";
import { buildHttpClient } from "./adapters/axios-adapter";

const DEV_SERVER_HOST = "http://localhost:3005";
const PROD_SERVER_HOST = "https://guarded-bayou-82640.herokuapp.com/"; //"https://api.irontimer.com:3005";

const API_PATH = "";
const BASE_URL =
  window.location.hostname === "localhost" ? DEV_SERVER_HOST : PROD_SERVER_HOST;
const API_URL = `${BASE_URL}${API_PATH}`;

const httpClient = buildHttpClient(API_URL, 15000);

// API Endpoints
const API = {
  users: new endpoints.Users(httpClient),
  utils: new endpoints.Utils(httpClient),
  configs: new endpoints.Configs(httpClient),
  solves: new endpoints.Solves(httpClient),
  psas: new endpoints.Psas(httpClient),
  presets: new endpoints.Presets(httpClient),
  sessions: new endpoints.Sessions(httpClient),
  apiKeys: new endpoints.ApiKeys(httpClient)
};

export default API;
