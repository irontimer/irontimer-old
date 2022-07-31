import { Log as ILog } from "utils";
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
    required: false
  }
});

export const Log = model("log", LogSchema);
