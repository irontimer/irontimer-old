import IronTimerError from "../utils/error";
import { ObjectId } from "mongodb";
import { FilterQuery } from "mongoose";
import { Preset } from "../models/preset";
import { Config, Preset as IPreset } from "../../types/types";

const MAX_PRESETS = 10;

function getPresetKeyFilter(
  userID: string,
  keyId: string
): FilterQuery<IPreset> {
  return {
    _id: new ObjectId(keyId),
    userID
  };
}

interface PresetCreationResult {
  presetId: string;
}

export async function getPresets(userID: string): Promise<IPreset[]> {
  const presets = await Preset.find({ userID }).sort({ timestamp: -1 });

  return presets; // this needs to be changed to later take patreon into consideration
}

export async function addPreset(
  userID: string,
  name: string,
  config: Config
): Promise<PresetCreationResult> {
  const presets = await getPresets(userID);

  if (presets.length >= MAX_PRESETS) {
    throw new IronTimerError(409, "Too many presets");
  }

  const preset = await Preset.create({
    userID,
    name,
    config
  });

  return {
    presetId: preset._id.toString()
  };
}

export async function editPreset(
  userID: string,
  presetId: string,
  name: string,
  config: Config
): Promise<void> {
  const presetUpdates =
    config && Object.keys(config).length > 0 ? { name, config } : { name };

  await Preset.updateOne(getPresetKeyFilter(userID, presetId), {
    $set: presetUpdates
  });
}

export async function removePreset(
  userID: string,
  presetId: string
): Promise<void> {
  const deleteResult = await Preset.deleteOne(
    getPresetKeyFilter(userID, presetId)
  );

  if (deleteResult.deletedCount === 0) {
    throw new IronTimerError(404, "Preset not found");
  }
}
