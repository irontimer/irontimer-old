import _ from "lodash";
import { ObjectId, MatchKeysAndValues } from "mongodb";
import IronTimerError from "../utils/error";
import { ApiKey as IApiKey } from "../../types/types";
import { ApiKey } from "../models/api-key";
import { FilterQuery } from "mongoose";

function getApiKeyFilter(userID: string, keyID: string): FilterQuery<IApiKey> {
  return {
    _id: new ObjectId(keyID),
    userID
  };
}

export async function getApiKeys(userID: string): Promise<IApiKey[]> {
  return await ApiKey.find({ userID });
}

export async function getApiKey(userID: string): Promise<IApiKey | undefined> {
  return (await ApiKey.findOne({ _id: userID })) ?? undefined;
}

export async function countApiKeysForUser(uid: string): Promise<number> {
  const apeKeys = await getApiKeys(uid);

  return _.size(apeKeys);
}

export async function addApiKey(apiKey: IApiKey): Promise<string> {
  const insertionResult = await ApiKey.create(apiKey);

  return insertionResult._id.toString();
}

async function updateApiKey(
  userID: string,
  keyId: string,
  updates: MatchKeysAndValues<IApiKey>
): Promise<void> {
  const updateResult = await ApiKey.updateOne(getApiKeyFilter(userID, keyId), {
    $inc: { useCount: _.has(updates, "lastUsedOn") ? 1 : 0 },
    $set: _.pickBy(updates, (value) => !_.isNil(value))
  });

  if (updateResult.modifiedCount === 0) {
    throw new IronTimerError(404, "ApiKey not found");
  }
}

export async function editApiKey(
  userID: string,
  keyId: string,
  name: string,
  enabled: boolean
): Promise<void> {
  const apiKeyUpdates = {
    name,
    enabled,
    modifiedOn: Date.now()
  };

  await updateApiKey(userID, keyId, apiKeyUpdates);
}

export async function updateLastUsedOn(
  userID: string,
  keyId: string
): Promise<void> {
  const apiKeyUpdates = {
    lastUsedOn: Date.now()
  };

  await updateApiKey(userID, keyId, apiKeyUpdates);
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
