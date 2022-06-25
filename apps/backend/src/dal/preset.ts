import IronTimerError from "../utils/error";
import { Types } from "mongoose";
import { FilterQuery } from "mongoose";
import { Preset } from "../models/preset";
import { Config, Saved, Preset as IPreset } from "@irontimer/utils";

const MAX_PRESETS = 10;

function getPresetKeyFilter(
  userID: string,
  apiKeyID: string
): FilterQuery<IPreset> {
  return {
    _id: new Types.ObjectId(apiKeyID),
    userID
  };
}

export async function getPresets(userID: string): Promise<IPreset[]> {
  const presets = await Preset.find({ userID }).sort({ timestamp: -1 });

  return presets; // this needs to be changed to later take patreon into consideration
}

export async function addPreset(
  userID: string,
  name: string,
  config: Saved<Config, string>
): Promise<Types.ObjectId> {
  const presets = await getPresets(userID);

  if (presets.length >= MAX_PRESETS) {
    throw new IronTimerError(409, "Too many presets");
  }

  const preset = await Preset.create({
    userID,
    name,
    config
  });

  return preset._id;
}

export async function editPreset(
  userID: string,
  presetID: string,
  name: string,
  config: Saved<Config, string>
): Promise<void> {
  const presetUpdates =
    config && Object.keys(config).length > 0 ? { name, config } : { name };

  await Preset.updateOne(getPresetKeyFilter(userID, presetID), {
    $set: presetUpdates
  });
}

export async function removePreset(
  userID: string,
  presetID: string
): Promise<void> {
  const deleteResult = await Preset.deleteOne(
    getPresetKeyFilter(userID, presetID)
  );

  if (deleteResult.deletedCount === 0) {
    throw new IronTimerError(404, "Preset not found");
  }
}
