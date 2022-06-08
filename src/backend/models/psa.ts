import { PSA as IPSA } from "../../types";
import { Schema, model } from "mongoose";

export const PSASchema = new Schema<IPSA>({
  _id: Schema.Types.ObjectId,
  sticky: {
    type: Boolean,
    required: false
  },
  message: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: false
  }
});

export const PSA = model("psa", PSASchema);
