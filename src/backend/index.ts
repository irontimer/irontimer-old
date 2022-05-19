import mongoose from "mongoose";
import { config } from "dotenv";
import express from "express";
import { User } from "./models/User";
import cors from "cors";

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

app.listen(3005, () => {
  console.log("Example app listening on port 3005!");
});
