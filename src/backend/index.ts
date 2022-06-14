import { run } from "./server";
try {
  run();
} catch (err) {
  console.log(err);
}

process.on("uncaughtException", (err) => console.log(err));
