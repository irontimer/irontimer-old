import * as PresetDAL from "../../dal/preset";
import { IronTimerResponse } from "../../utils/irontimer-response";
import { Request } from "../../../types";

export async function getPresets(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const preset = await PresetDAL.getPresets(userID);

  return new IronTimerResponse("Preset retrieved", preset);
}

export async function addPreset(req: Request): Promise<IronTimerResponse> {
  const { name, config } = req.body;
  const { userID } = req.ctx.decodedToken;

  await PresetDAL.addPreset(userID, name, config);

  return new IronTimerResponse("Preset created");
}

export async function editPreset(req: Request): Promise<IronTimerResponse> {
  const { _id, name, config } = req.body;
  const { userID } = req.ctx.decodedToken;

  await PresetDAL.editPreset(userID, _id, name, config);

  return new IronTimerResponse("Preset updated");
}

export async function removePreset(req: Request): Promise<IronTimerResponse> {
  const { presetID } = req.params;
  const { userID } = req.ctx.decodedToken;

  await PresetDAL.removePreset(userID, presetID);

  return new IronTimerResponse("Preset deleted");
}
