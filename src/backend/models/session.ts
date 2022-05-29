import { Session as ISession, Saved } from "../../types";
import { Schema, model } from "mongoose";
import { SCRAMBLE_TYPES } from "../../constants/scramble-type";

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

export const Session = model<Saved<ISession>>("Session", SessionSchema);
