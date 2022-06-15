import type { Config as IConfig, Saved } from "../../types";
import { Schema, model } from "mongoose";
import { CONFIG_VALUES } from "../../constants/config";

export const configProps = {
  timerType: {
    type: String,
    enum: CONFIG_VALUES.timerType,
    required: true
  },
  currentSession: {
    type: String,
    required: true
  },
  displayAverages: {
    type: [Number],
    required: true
  }
};

export const ConfigSchema = new Schema<Saved<IConfig, string>>({
  // since the userID is unique to each user we can use it as the _id
  _id: {
    type: String,
    required: true
  },
  ...configProps
});

export const Config = model("config", ConfigSchema);
