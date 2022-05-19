import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  userID: string;
  displayName: string;
  discordUserID: string;
}

const UserSchema = new Schema<IUser>({
  email: String,
  userID: String,
  displayName: String,
  discordUserID: String
});

export const User = model("User", UserSchema);
