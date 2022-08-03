import { model, Schema } from "mongoose";
import { PublicStats as IPublicStats } from "utils";

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
