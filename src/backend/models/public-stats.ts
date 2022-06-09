import { PublicStats as IPublicStats } from "../../types";
import { Schema, model } from "mongoose";

export const PublicStatsSchema = new Schema<IPublicStats>({
  _id: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ["stats"],
    required: true
  },
  solveCount: {
    type: Number,
    required: true
  },
  timeCubing: {
    type: Number,
    required: true
  }
});

export const PublicStats = model("public", PublicStatsSchema);
