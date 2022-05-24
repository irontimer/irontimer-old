import { model, Schema } from "mongoose";
import { ApiKey as IApiKey } from "../../types/types";

export const ApiKeySchema = new Schema<IApiKey>({
  _id: Schema.Types.ObjectId,
  name: String,
  enabled: Boolean,
  userID: String,
  hash: String,
  createdOn: Number,
  modifiedOn: Number,
  lastUsedOn: Number,
  useCount: Number
});

export const ApiKey = model<IApiKey>("api-key", ApiKeySchema);
