import _ from "lodash";
import IronTimerError from "../utils/error";
import { ApiKey as IApiKey, MatchKeysAndValues } from "utils";
import { ApiKey } from "../models/api-key";
import { FilterQuery, Types } from "mongoose";

function getApiKeyFilter(userID: string, keyID: string): FilterQuery<IApiKey> {
  return {
    _id: new Types.ObjectId(keyID),
    userID
  };
}

export async function getApiKeys(userID: string): Promise<IApiKey[]> {
  return await ApiKey.find({ userID });
}

export async function getApiKey(userID: string): Promise<IApiKey | undefined> {
  return (await ApiKey.findById(userID)) ?? undefined;
}

export async function countApiKeysForUser(userID: string): Promise<number> {
  const apiKeys = await getApiKeys(userID);

  return _.size(apiKeys);
}

export async function addApiKey(apiKey: IApiKey): Promise<string> {
  const newApiKey = await ApiKey.create(apiKey);

  return newApiKey._id.toString();
}

async function updateApiKey(
  userID: string,
  apiKeyID: string,
  updates: MatchKeysAndValues<IApiKey>
): Promise<void> {
  const updateResult = await ApiKey.updateOne(
    getApiKeyFilter(userID, apiKeyID),
    {
      $inc: { useCount: _.has(updates, "lastUsedOn") ? 1 : 0 },
      $set: _.pickBy(updates, (value) => !_.isNil(value))
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw new IronTimerError(404, "ApiKey not found");
  }
}

export async function editApiKey(
  userID: string,
  apiKeyID: string,
  name: string,
  enabled: boolean
): Promise<void> {
  const apiKeyUpdates = {
    name,
    enabled,
    modifiedOn: Date.now()
  };

  await updateApiKey(userID, apiKeyID, apiKeyUpdates);
}

export async function updateLastUsedOn(
  userID: string,
  apiKeyID: string
): Promise<void> {
  const apiKeyUpdates = {
    lastUsedOn: Date.now()
  };

  await updateApiKey(userID, apiKeyID, apiKeyUpdates);
}

export async function deleteApiKey(
  userID: string,
  keyID: string
): Promise<void> {
  const deletionResult = await ApiKey.deleteOne(getApiKeyFilter(userID, keyID));

  if (deletionResult.deletedCount === 0) {
    throw new IronTimerError(404, "ApiKey not found");
  }
}
