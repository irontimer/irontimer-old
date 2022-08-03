import { model, Schema } from "mongoose";
import { Saved, SCRAMBLE_TYPES, Session as ISession } from "utils";

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
