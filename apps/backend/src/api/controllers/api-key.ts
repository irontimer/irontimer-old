import _ from "lodash";
import { randomBytes } from "crypto";
import { hash } from "bcrypt";
import * as ApiKeysDAL from "../../dal/api-keys";
import IronTimerError from "../../utils/error";
import { IronTimerResponse } from "../../utils/irontimer-response";
import { base64UrlEncode } from "../../utils/misc";

import {
  ApiKey as IApiKey,
  GenerateApiKeyResponse,
  Request
} from "utils";
import { ApiKey } from "../../models/api-key";

function cleanApiKey(apiKey: IApiKey): Partial<IApiKey> {
  return _.omit(apiKey, "hash", "_id", "userID", "useCount");
}

export async function getApiKeys(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const apiKeys = await ApiKeysDAL.getApiKeys(userID);

  const cleanedKeys = _(apiKeys).keyBy("_id").mapValues(cleanApiKey).value();

  return new IronTimerResponse("ApiKeys retrieved", cleanedKeys);
}

export async function generateApiKey(req: Request): Promise<IronTimerResponse> {
  const { name, enabled } = req.body;
  const { userID } = req.ctx.decodedToken;
  const { maxKeysPerUser, apiKeyBytes, apiKeySaltRounds } =
    req.ctx.configuration.apiKeys;

  const currentNumberOfApiKeys = await ApiKeysDAL.countApiKeysForUser(userID);

  if (currentNumberOfApiKeys >= maxKeysPerUser) {
    throw new IronTimerError(
      409,
      "Maximum number of ApiKeys have been generated"
    );
  }

  const apiKey = randomBytes(apiKeyBytes).toString("base64url");

  const saltyHash = await hash(apiKey, apiKeySaltRounds);

  const apiKeyObject = new ApiKey({
    name,
    enabled,
    userID,
    hash: saltyHash,
    createdOn: Date.now(),
    modifiedOn: Date.now(),
    lastUsedOn: -1,
    useCount: 0
  });

  const apiKeyID = await ApiKeysDAL.addApiKey(apiKeyObject);

  const res: GenerateApiKeyResponse = {
    apiKey: base64UrlEncode(`${apiKeyID}.${apiKey}`),
    apiKeyID,
    apiKeyDetails: cleanApiKey(apiKeyObject)
  };

  return new IronTimerResponse("ApiKey generated", res);
}

export async function editApiKey(req: Request): Promise<IronTimerResponse> {
  const { apiKeyID } = req.params;
  const { name, enabled } = req.body;
  const { userID } = req.ctx.decodedToken;

  await ApiKeysDAL.editApiKey(userID, apiKeyID, name, enabled);

  return new IronTimerResponse("ApiKey updated");
}

export async function deleteApiKey(req: Request): Promise<IronTimerResponse> {
  const { apiKeyID } = req.params;
  const { userID } = req.ctx.decodedToken;

  await ApiKeysDAL.deleteApiKey(userID, apiKeyID);

  return new IronTimerResponse("ApiKey deleted");
}
