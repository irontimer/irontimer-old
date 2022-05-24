import { UpdateResult } from "mongodb";
import _ from "lodash";
import { Config } from "../models/config";
import type { Config as IConfig } from "../../types";

export async function saveConfig(
  userID: string,
  config: IConfig
): Promise<UpdateResult> {
  const configChanges = _.mapKeys(config, (_value, key) => `config.${key}`);

  return await Config.updateOne(
    { _id: userID },
    { $set: configChanges },
    { upsert: true }
  );
}

export async function getConfig(userID: string): Promise<IConfig | undefined> {
  const config = await Config.findOne({ _id: userID });

  if (config === null) {
    return;
  }

  return config;
}
