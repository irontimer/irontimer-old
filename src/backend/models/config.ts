import type { SavedConfig as IConfig } from "../../types";
import { Schema, model } from "mongoose";

export const ConfigSchema = new Schema<IConfig>({
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
  scrambleType: {
    type: String,
    enum: ["3x3x3", "2x2x2"],
    required: true
  } // TODO remove and add sessions
});

export const Config = model<IConfig>("config", ConfigSchema);
