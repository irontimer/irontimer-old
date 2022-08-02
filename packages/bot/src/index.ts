import { Client, ClientOptions } from "fero-dc";

import { config } from "dotenv";

// eslint-disable-next-line
// @ts-ignore
import clientOptions from "./config/config.json";

config();

const token = process.env["TOKEN"];

if (!token) {
  throw new Error("Token not found");
}

const client = new Client(clientOptions as ClientOptions, __dirname);

client.start(token);
