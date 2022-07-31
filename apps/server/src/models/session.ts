import { Session as ISession, Saved, SCRAMBLE_TYPES } from "utils";
import { Schema, model } from "mongoose";

export const SessionSchema = new Schema<Saved<ISession>>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  scrambleType: {
    type: String,
    enum: SCRAMBLE_TYPES,
    required: true
  }
});

export const Session = model("Session", SessionSchema);
