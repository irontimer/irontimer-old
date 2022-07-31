import { Schema, model } from "mongoose";
import { ApiKey as IApiKey } from "utils";

export const ApiKeySchema = new Schema<IApiKey>({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  createdOn: {
    type: Number,
    required: true
  },
  modifiedOn: {
    type: Number,
    required: true
  },
  lastUsedOn: {
    type: Number,
    required: true
  },
  useCount: {
    type: Number,
    required: true
  }
});

export const ApiKey = model("api-key", ApiKeySchema);
