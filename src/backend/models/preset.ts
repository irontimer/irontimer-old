import type { Preset as IPreset } from "../../types";
import { Schema, model } from "mongoose";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";

export const PresetSchema = new Schema<IPreset>({
  _id: Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  config: {
    timerType: {
      type: String,
      enum: ["timer", "typing", "stackmat"],
      required: true
    },
    scrambleType: {
      type: String,
      enum: SCRAMBLE_TYPES,
      required: true
    }
  }
});

export const Preset = model("preset", PresetSchema);
