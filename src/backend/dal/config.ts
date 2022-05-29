import type { UpdateResult } from "mongodb";
import _ from "lodash";
import { Config } from "../models/config";
import type { Config as IConfig, Saved } from "../../types";

export async function addConfig(
  userID: string,
  config: IConfig
): Promise<{ insertedID: string }> {
  await Config.create({
    ...config,
    _id: userID
  });

  return {
    insertedID: userID
  };
}

export async function saveConfig(
  userID: string,
  config: Saved<IConfig> | IConfig
): Promise<UpdateResult> {
  const configChanges = _.mapKeys(config, (_value, key) => `config.${key}`);

  const existingConfig = await Config.findById(userID);

  if (existingConfig === null) {
    await addConfig(userID, config);
  }

  return await Config.updateOne(
    { _id: userID },
    { $set: configChanges },
    { upsert: true }
  );
}

export async function getConfig(
  userID: string
): Promise<Saved<IConfig> | undefined> {
  return (await Config.findById(userID)) ?? undefined;
}
