import { Log as ILog } from "../../types";
import { Schema, model } from "mongoose";

export const LogSchema = new Schema<ILog>({
  timestamp: {
    type: Number,
    required: true
  },
  userID: {
    type: String,
    required: false
  },
  event: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

export const Log = model<ILog>("log", LogSchema);
