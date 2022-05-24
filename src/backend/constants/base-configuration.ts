import { Configuration } from "../../types";

/**
 * This is the base schema for the configuration of the API backend.
 * To add a new configuration. Simply add it to this object.
 * When changing this template, please follow the principle of "Secure by default" (https://en.wikipedia.org/wiki/Secure_by_default).
 */
const BASE_CONFIGURATION: Configuration = {
  maintenance: false,
  apiKeys: {
    endpointsEnabled: false,
    acceptKeys: false,
    maxKeysPerUser: 0,
    apiKeyBytes: 24,
    apiKeySaltRounds: 5
  },
  enableSavingResults: {
    enabled: false
  }
};

export default BASE_CONFIGURATION;
