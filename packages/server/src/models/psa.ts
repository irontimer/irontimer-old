import { model, Schema } from "mongoose";
import { PSA as IPSA } from "utils";

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
