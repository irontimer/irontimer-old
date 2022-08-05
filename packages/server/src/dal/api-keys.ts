import _ from "lodash";
import type { ApiKey, Prisma } from "utils";
import prisma from "../init/db";
import IronTimerError from "../utils/error";

export async function getApiKeys(uid: string): Promise<ApiKey[]> {
  return await prisma.apiKey.findMany({ where: { uid } });
}

export async function getUserApiKey(
  uid: string,
  id: string
): Promise<ApiKey | undefined> {
  return (await prisma.apiKey.findFirst({ where: { id, uid } })) ?? undefined;
}

export async function getApiKey(id: string): Promise<ApiKey | undefined> {
  return (await prisma.apiKey.findFirst({ where: { id } })) ?? undefined;
  0;
}

export async function countApiKeysForUser(uid: string): Promise<number> {
  const apiKeys = await getApiKeys(uid);

  return apiKeys.length;
}

export async function addApiKey(
  data: Prisma.ApiKeyCreateInput
): Promise<string> {
  const newApiKey = await prisma.apiKey.create({ data });

  return newApiKey.id;
}

async function updateApiKey(
  uid: string,
  apiKeyId: string,
  updates: Partial<ApiKey>
): Promise<void> {
  const existing = await getUserApiKey(uid, apiKeyId);

  if (!existing) {
    throw new IronTimerError(404, "ApiKey not found");
  }

  const updateResult = await prisma.apiKey.update({
    where: {
      id: apiKeyId
    },
    data: {
      useCount: {
        increment: _.has(updates, "lastUsedAt") ? 1 : 0
      },
      ...updates
    }
  });

  if (!updateResult) {
    throw new IronTimerError(404, "ApiKey not found");
  }
}

export async function editApiKey(
  uid: string,
  apiKeyId: string,
  name: string,
  enabled: boolean
): Promise<void> {
  await updateApiKey(uid, apiKeyId, {
    name,
    enabled
  });
}

export async function updateLastUsedOn(
  uid: string,
  apiKeyId: string
): Promise<void> {
  await updateApiKey(uid, apiKeyId, {
    lastUsedAt: new Date(Date.now())
  });
}

export async function deleteApiKey(uid: string, keyId: string): Promise<void> {
  const existing = await getUserApiKey(uid, keyId);

  if (!existing) {
    throw new IronTimerError(404, "ApiKey not found");
  }

  const deletionResult = await prisma.apiKey.delete({
    where: {
      id: keyId
    }
  });

  if (!deletionResult) {
    throw new IronTimerError(404, "ApiKey not found");
  }
}
