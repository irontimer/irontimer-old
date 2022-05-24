import { User as IUser } from "../../types/types";
import { Schema, model } from "mongoose";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";

export const UserSchema = new Schema<IUser>({
  _id: Schema.Types.ObjectId,
  userID: {
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
