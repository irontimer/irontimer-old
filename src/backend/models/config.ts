import type { Config as IConfig } from "../../types";
import { Schema, model } from "mongoose";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";

export const ConfigSchema = new Schema<IConfig>({
  _id: Schema.Types.ObjectId, // this will be the user's id
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

export const Config = model<IConfig>("config", ConfigSchema);
