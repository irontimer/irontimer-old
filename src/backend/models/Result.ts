import { Schema, model } from "mongoose";
import type { Result as IResult } from "../../types/types";

const ResultSchema = new Schema<IResult & { userID: string }>({
  userID: String,
  time: Number,
  timestamp: Number,
  puzzle: {
    type: {
      type: String,
      enum: ["Cube", "Megaminx", "Pyraminx", "Skewb", "Square-1"]
    },
    size: Number
  },
  scramble: Array,
  solution: {
    type: Array,
    required: false
  }
});

export const Result = model("Result", ResultSchema);
