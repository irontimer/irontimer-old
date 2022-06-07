import { config } from "dotenv";
import admin, { ServiceAccount } from "firebase-admin";
import { readFileSync } from "fs";
import * as db from "./init/db";
import jobs from "./jobs";
import { getLiveConfiguration } from "./init/configuration";
import app from "./app";
import { Server } from "http";
import { version } from "./version";
import { recordServerVersion } from "./utils/prometheus";
import * as RedisClient from "./init/redis";
import { initJobQueue } from "./tasks/bot";
import Logger from "./utils/logger";

config();

async function bootServer(port: number): Promise<Server> {
  try {
    Logger.info(`Connecting to database ${process.env.DATABASE_NAME}...`);
    await db.connect();
    Logger.success("Connected to database");

    Logger.info("Initializing Firebase app instance...");

    const serviceAccount: ServiceAccount = JSON.parse(
      (process.env.FIREBASE_SERVICE_ACCOUNT !== undefined
        ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64")
        : readFileSync("./src/backend/credentials/serviceAccountKey.json")
      ).toString()
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    Logger.success("Firebase app initialized");

    Logger.info("Fetching live configuration...");
    await getLiveConfiguration();
    Logger.success("Live configuration fetched");

    Logger.info("Connecting to redis...");
    await RedisClient.connect();

    if (RedisClient.isConnected()) {
      Logger.success("Connected to redis");

      Logger.info("Initializing task queues...");
      initJobQueue(RedisClient.getConnection());
      Logger.success("Task queues initialized");
    }

    Logger.info("Starting cron jobs...");
    jobs.forEach((job) => job.start());
    Logger.success("Cron jobs started");

    recordServerVersion(version);
  } catch (error: any) {
    Logger.error("Failed to boot server");
    Logger.error(error);
    return process.exit(1);
  }

  return app.listen(PORT, () => {
    Logger.success(`API server listening on port ${port}`);
  });
}

const PORT = parseInt(process.env.PORT ?? "3005", 10);

export function run(): Promise<Server> {
  return bootServer(PORT);
}
