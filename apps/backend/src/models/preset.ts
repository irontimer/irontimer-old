import type { Preset as IPreset } from "@irontimer/utils";
import { Schema, model } from "mongoose";
import { configProps } from "./config";

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
  config: configProps
});

export const Preset = model("preset", PresetSchema);
