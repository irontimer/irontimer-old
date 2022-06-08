import _ from "lodash";
import Logger from "../utils/logger";
import { identity } from "../utils/misc";
import BASE_CONFIGURATION from "../constants/base-configuration";
import { Configuration as IConfiguration } from "../../types";
import { Configuration } from "../models/configuration";

const CONFIG_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 Minutes

function mergeConfigurations(
  baseConfiguration: IConfiguration,
  liveConfiguration: IConfiguration
): void {
  if (
    !_.isPlainObject(baseConfiguration) ||
    !_.isPlainObject(liveConfiguration)
  ) {
    return;
  }

  function merge(base: Record<string, any>, source: Record<string, any>): void {
    const commonKeys = _.intersection(_.keys(base), _.keys(source));

    commonKeys.forEach((key) => {
      const baseValue = base[key];
      const sourceValue = source[key];

      const isBaseValueObject = _.isPlainObject(baseValue);
      const isSourceValueObject = _.isPlainObject(sourceValue);

      if (isBaseValueObject && isSourceValueObject) {
        merge(baseValue, sourceValue);
      } else if (identity(baseValue) === identity(sourceValue)) {
        base[key] = sourceValue;
      }
    });
  }

  merge(baseConfiguration, liveConfiguration);
}

let configuration = BASE_CONFIGURATION;
let lastFetchTime = 0;
let serverConfigurationUpdated = false;

export async function getCachedConfiguration(
  attemptCacheUpdate = false
): Promise<IConfiguration> {
  if (
    attemptCacheUpdate &&
    lastFetchTime < Date.now() - CONFIG_UPDATE_INTERVAL
  ) {
    Logger.info("Cached configuration is stale.");
    return await getLiveConfiguration();
  }

  return configuration;
}

export async function getLiveConfiguration(): Promise<IConfiguration> {
  lastFetchTime = Date.now();

  try {
    const liveConfiguration = await Configuration.findOne();

    if (liveConfiguration) {
      const baseConfiguration = _.cloneDeep(BASE_CONFIGURATION);

      const liveConfigurationWithoutID = _.omit(
        liveConfiguration,
        "_id"
      ) as IConfiguration;
      mergeConfigurations(baseConfiguration, liveConfigurationWithoutID);

      pushConfiguration(baseConfiguration);
      configuration = baseConfiguration;
    } else {
      await Configuration.create({
        ...BASE_CONFIGURATION
      }); // Seed the base configuration.
    }
  } catch (error: any) {
    Logger.logToDb(
      "fetch_configuration_failure",
      `Could not fetch configuration: ${error.message}`
    );
  }

  return configuration;
}

async function pushConfiguration(configuration: IConfiguration): Promise<void> {
  if (serverConfigurationUpdated) {
    return;
  }

  try {
    await Configuration.replaceOne({}, configuration);
    serverConfigurationUpdated = true;
  } catch (error: any) {
    Logger.logToDb(
      "push_configuration_failure",
      `Could not push configuration: ${error.message}`
    );
  }
}
