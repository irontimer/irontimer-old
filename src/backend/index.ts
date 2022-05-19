import mongoose from "mongoose";
import { config } from "dotenv";
import express from "express";

config({
  path: `${process.cwd()}/.env`
});

if (
  process.env.MONGODB_URI === undefined ||
  process.env.DATABASE_NAME === undefined
) {
  throw new Error("MONGODB_URI or DATABASE_NAME are not defined");
}

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DATABASE_NAME
  })
  .then(async () => {
    console.log("Connected to MongoDB");
  });

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3005, () => {
  console.log("Example app listening on port 3000!");
});
