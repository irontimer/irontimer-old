import { connect as mongooseConnect, ConnectOptions } from "mongoose";
import Logger from "../utils/logger";

export async function connect(): Promise<void> {
  const { MONGODB_URI, DATABASE_NAME } = process.env;

  if (!MONGODB_URI || !DATABASE_NAME) {
    throw new Error("No database configuration provided");
  }

  const connectionOptions: ConnectOptions = {
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 2000,
    dbName: DATABASE_NAME
  };

  try {
    await mongooseConnect(MONGODB_URI, connectionOptions);
  } catch (error: any) {
    Logger.error(error.message);
    Logger.error(
      "Failed to connect to database. Exiting with exit status code 1."
    );
    // process.exit(1);
    throw error;
  }
}
