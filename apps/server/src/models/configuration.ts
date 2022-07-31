import { Configuration as IConfiguration } from "utils";
import { Schema, model } from "mongoose";

export const ConfigurationSchema = new Schema<IConfiguration>({
  maintenance: {
    type: Boolean,
    default: false
  },
  apiKeys: {
    endpointsEnabled: {
      type: Boolean,
      default: true
    },
    acceptKeys: {
      type: Boolean,
      default: true
    },
    maxKeysPerUser: {
      type: Number,
      default: 5
    },
    apiKeyBytes: {
      type: Number,
      default: 32
    },
    apiKeySaltRounds: {
      type: Number,
      default: 10
    }
  },
  enableSavingSolves: {
    enabled: {
      type: Boolean,
      default: true
    }
  }
});

export const Configuration = model("configuration", ConfigurationSchema);
