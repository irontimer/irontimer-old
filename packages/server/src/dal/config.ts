import type { Config, Unsaved } from "utils";
import prisma from "../init/db";

export async function addConfig(
  uid: string,
  config: Config | Unsaved<Config>
): Promise<string> {
  await prisma.config.create({
    data: {
      ...config,
      id: uid
    }
  });

  return uid;
}

export async function saveConfig(
  uid: string,
  config: Config | Unsaved<Config>
): Promise<Config> {
  const existingConfig = await prisma.config.findUnique({
    where: {
      id: uid
    }
  });

  if (existingConfig === null) {
    await addConfig(uid, config);
  }

  return await prisma.config.update({
    where: {
      id: uid
    },
    data: config
  });
}

export async function getConfig(uid: string): Promise<Config | undefined> {
  return (
    (await prisma.config.findUnique({
      where: {
        id: uid
      }
    })) ?? undefined
  );
}
