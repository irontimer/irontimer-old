import type { Config as IConfig, Saved } from "../../types";
import { Schema, model } from "mongoose";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";

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
  scrambleType: {
    type: String,
    enum: SCRAMBLE_TYPES,
    required: true
  } // TODO remove and add sessions
});

export const Config = model<Saved<IConfig>>("config", ConfigSchema);
