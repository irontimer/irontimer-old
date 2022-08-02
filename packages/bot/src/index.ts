import { Client, ClientOptions } from "fero-dc";

import { config } from "dotenv";

import * as fs from "fs";
import * as path from "path";

const configPath = path.resolve(`${__dirname}/config/config.json`);

if (!fs.existsSync(configPath)) {
  throw new Error("config.json not found");
}

const clientOptions: ClientOptions = JSON.parse(
  fs.readFileSync(configPath).toString() ?? "null"
);

if (clientOptions === null) {
  throw new Error("config.json is empty");
}

config();

const token = process.env["TOKEN"];

if (!token) {
  throw new Error("Token not found");
}

const client = new Client(clientOptions as ClientOptions, __dirname);

client.start(token);
