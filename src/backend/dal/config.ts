import { UpdateResult } from "mongodb";
import _ from "lodash";
import { Config } from "../models/config";
import type { SavedConfig as IConfig } from "../../types";
import { Types } from "mongoose";

export async function addConfig(
  userID: string,
  config: IConfig
): Promise<{ insertedID: Types.ObjectId }> {
  const _id = new Types.ObjectId();

  await Config.create({
    ...config,
    _id
  });

  return {
    insertedID: _id
  };
}

export async function saveConfig(
  userID: string,
  config: IConfig
): Promise<UpdateResult> {
  const configChanges = _.mapKeys(config, (_value, key) => `config.${key}`);

  const existingConfig = await Config.findOne({ _id: userID });

  if (existingConfig === null) {
    await addConfig(userID, config);
  }

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
