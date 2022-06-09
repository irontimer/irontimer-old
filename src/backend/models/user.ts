import { User as IUser } from "../../types";
import { Schema, model } from "mongoose";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";

export const UserSchema = new Schema<IUser>({
  // since the userID is unique to each user we can use it as the _id
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  discordUserID: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  personalBests: {
    type: [
      {
        time: {
          type: Number,
          required: true
        },
        timestamp: {
          type: Number,
          required: true
        },
        scramble: {
          type: String,
          required: true
        },
        scrambleType: {
          type: String,
          enum: SCRAMBLE_TYPES,
          required: true
        },
        solution: {
          type: String,
          required: false
        }
      }
    ],
    required: true
  },
  canManageApiKeys: {
    type: Boolean,
    required: true
  },
  timeCubing: {
    type: Number,
    required: true
  },
  solveCount: {
    type: Number,
    required: true
  },
  lastNameChange: {
    type: Number,
    required: false
  }
});

export const User = model("user", UserSchema);
