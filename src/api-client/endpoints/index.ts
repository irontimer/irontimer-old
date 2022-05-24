import getConfigsEndpoints from "./configs";
import getPresetsEndpoints from "./presets";
import getPsasEndpoints from "./psas";
import getResultsEndpoints from "./results";
import getUsersEndpoints from "./users";
import getApiKeysEndpoints from "./api-keys";

export default {
  getConfigsEndpoints,
  getPresetsEndpoints,
  getPsasEndpoints,
  getResultsEndpoints,
  getUsersEndpoints,
  getApiKeysEndpoints: getApiKeysEndpoints
};
