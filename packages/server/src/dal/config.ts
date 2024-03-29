import type { Config as IConfig, Saved, UpdateResult } from "utils";
import { Config } from "../models/config";

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
  const existingConfig = await Config.findById(userID);

  if (existingConfig === null) {
    await addConfig(userID, config);
  }

  return await Config.updateOne(
    { _id: userID },
    { $set: config },
    { upsert: true }
  );
}

export async function getConfig(
  userID: string
): Promise<Saved<IConfig> | undefined> {
  return (await Config.findById(userID)) ?? undefined;
}
