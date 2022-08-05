import _ from "lodash";
import { Configuration } from "utils";
import BASE_CONFIGURATION from "../constants/base-configuration";
import Logger from "../utils/logger";
import { identity } from "../utils/misc";
import prisma from "./db";

const CONFIG_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 Minutes

function mergeConfigurations(
  baseConfiguration: Configuration,
  liveConfiguration: Configuration
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
): Promise<Configuration> {
  if (
    attemptCacheUpdate &&
    lastFetchTime < Date.now() - CONFIG_UPDATE_INTERVAL
  ) {
    Logger.info("Cached configuration is stale.");
    return await getLiveConfiguration();
  }

  return configuration;
}

export async function getLiveConfiguration(): Promise<Configuration> {
  lastFetchTime = Date.now();

  try {
    const liveConfiguration = await prisma.configuration.findFirst();

    if (liveConfiguration) {
      const baseConfiguration = _.cloneDeep(BASE_CONFIGURATION);

      const liveConfigurationWithoutId = _.omit(
        liveConfiguration,
        "_id"
      ) as Configuration;
      mergeConfigurations(baseConfiguration, liveConfigurationWithoutId);

      pushConfiguration(baseConfiguration);
      configuration = baseConfiguration;
    } else {
      await prisma.configuration.create({
        data: BASE_CONFIGURATION
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

async function pushConfiguration(configuration: Configuration): Promise<void> {
  if (serverConfigurationUpdated) {
    return;
  }

  try {
    await prisma.configuration.updateMany({ data: configuration });

    serverConfigurationUpdated = true;
  } catch (error: any) {
    Logger.logToDb(
      "push_configuration_failure",
      `Could not push configuration: ${error.message}`
    );
  }
}
