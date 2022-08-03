import { model, Schema } from "mongoose";
import { CONFIG_VALUES, Saved, Solve as ISolve } from "utils";

export const SolveSchema = new Schema<Saved<ISolve>>({
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
  session: {
    type: String,
    required: true
  },
  penalty: {
    type: String,
    enum: ["OK", "+2", "DNF"],
    required: true
  },
  enteredBy: {
    type: String,
    enum: CONFIG_VALUES.timerType,
    required: true
  },
  scramble: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: false
  }
});

export const Solve = model("solve", SolveSchema);
