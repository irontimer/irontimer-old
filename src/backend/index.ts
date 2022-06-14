import { run } from "./server";

run();

process.on("uncaughtException", (err) => console.log(err));
