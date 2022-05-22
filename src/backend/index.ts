import mongoose from "mongoose";
import { config } from "dotenv";
import express from "express";
import { User } from "./models/User";
import cors from "cors";
import { Result } from "./models/Result";

const PORT = 3005;

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// add an endpoint for creating a user in the database
app.post("/users", async (req, res) => {
  const { email, username, userID } = req.body;

  if (email === undefined || username === undefined || userID === undefined) {
    res.status(400).send("Missing email, username, or userID");

    return;
  }

  const user = await User.create({
    email,
    username,
    userID
  });

  res.json(user);
});

app.get("/results", async (req, res) => {
  const { userID } = req.query;

  if (userID === undefined) {
    res.status(400).send("Missing userID");

    return;
  }

  const results = await Result.find({ userID });

  res.json(results);
});

app.post("/results", async (req, res) => {
  const { userID, result } = req.body;

  if (userID === undefined || result === undefined) {
    res.status(400).send("Missing userID or result");

    return;
  }

  const user = await User.findOne({ userID });

  if (user === undefined) {
    res.status(400).send("User not found");

    return;
  }

  const newResult = await Result.create({
    userID,
    ...result
  });

  res.json(newResult);
});

app.delete("/results", async (req, res) => {
  const { resultID } = req.query;

  if (resultID === undefined) {
    res.status(400).send("Missing resultID");

    return;
  }

  const result = await Result.findOne({ resultID });

  if (result === undefined) {
    res.status(400).send("Result not found");

    return;
  }

  await Result.deleteOne({ resultID });

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
