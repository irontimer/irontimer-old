import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import _ from "lodash";
import { ApiKey, GenerateApiKeyResponse, Request } from "utils";
import * as ApiKeysDAL from "../../dal/api-keys";
import IronTimerError from "../../utils/error";
import { IronTimerResponse } from "../../utils/irontimer-response";
import { base64UrlEncode } from "../../utils/misc";

function cleanApiKey(apiKey: Partial<ApiKey>): Partial<ApiKey> {
  return _.omit(apiKey, "hash", "_id", "uid", "useCount");
}

export async function getApiKeys(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const apiKeys = await ApiKeysDAL.getApiKeys(uid);

  const cleanedKeys = _(apiKeys).keyBy("_id").mapValues(cleanApiKey).value();

  return new IronTimerResponse("ApiKeys retrieved", cleanedKeys);
}

export async function generateApiKey(req: Request): Promise<IronTimerResponse> {
  const { name, enabled } = req.body;
  const { uid } = req.ctx.decodedToken;
  const { maxKeysPerUser, apiKeyBytes, apiKeySaltRounds } =
    req.ctx.configuration.apiKeys;

  const currentNumberOfApiKeys = await ApiKeysDAL.countApiKeysForUser(uid);

  if (currentNumberOfApiKeys >= maxKeysPerUser) {
    throw new IronTimerError(
      409,
      "Maximum number of ApiKeys have been generated"
    );
  }

  const apiKey = randomBytes(apiKeyBytes).toString("base64url");

  const saltyHash = await hash(apiKey, apiKeySaltRounds);

  const apiKeyObject = {
    name,
    enabled,
    uid,
    hash: saltyHash,
    useCount: 0
  };

  const apiKeyId = await ApiKeysDAL.addApiKey(apiKeyObject);

  const res: GenerateApiKeyResponse = {
    apiKey: base64UrlEncode(`${apiKeyId}.${apiKey}`),
    apiKeyId,
    apiKeyDetails: cleanApiKey(apiKeyObject)
  };

  return new IronTimerResponse("ApiKey generated", res);
}

export async function editApiKey(req: Request): Promise<IronTimerResponse> {
  const { apiKeyId } = req.params;
  const { name, enabled } = req.body;
  const { uid } = req.ctx.decodedToken;

  await ApiKeysDAL.editApiKey(uid, apiKeyId, name, enabled);

  return new IronTimerResponse("ApiKey updated");
}

export async function deleteApiKey(req: Request): Promise<IronTimerResponse> {
  const { apiKeyId } = req.params;
  const { uid } = req.ctx.decodedToken;

  await ApiKeysDAL.deleteApiKey(uid, apiKeyId);

  return new IronTimerResponse("ApiKey deleted");
}
