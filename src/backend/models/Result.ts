import { Result as IResult } from "../../types";
import { Schema, model } from "mongoose";

export const ResultSchema = new Schema<IResult>({
  _id: Schema.Types.ObjectId,
  userID: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  scrambleType: {
    type: String,
    enum: ["3x3x3"],
    required: true
  },
  scramble: {
    type: String,
    required: true
  },
  solution: {
    type: [String],
    required: false
  }
});

export const Result = model<IResult>("result", ResultSchema);
