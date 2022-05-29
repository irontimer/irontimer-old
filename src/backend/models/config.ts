import type { Config as IConfig, Saved } from "../../types";
import { Schema, model } from "mongoose";

export const ConfigSchema = new Schema<Saved<IConfig>>({
  // since the userID is unique to each use we can use it as the _id
  _id: {
    type: String,
    required: true
  },
  timerType: {
    type: String,
    enum: ["timer", "typing", "stackmat"],
    required: true
  },
  currentSession: {
    type: String,
    required: true
  }
});

export const Config = model<Saved<IConfig>>("config", ConfigSchema);
