import { Schema, model } from "mongoose";
import { User as IUser } from "../../types/types";

const UserSchema = new Schema<IUser>({
  email: String,
  userID: String,
  username: String,
  discordUserID: String
});

export const User = model("User", UserSchema);
