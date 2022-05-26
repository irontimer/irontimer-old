import { User as IUser } from "../../types";
import { Schema, model } from "mongoose";

export const UserSchema = new Schema<IUser>({
  // since the userID is unique to each use we can use it as the _id
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
    required: false
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
          enum: ["3x3x3", "2x2x2"],
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
  resultCount: {
    type: Number,
    required: true
  },
  lastNameChange: {
    type: Number,
    required: false
  }
});

export const User = model<IUser>("user", UserSchema);
