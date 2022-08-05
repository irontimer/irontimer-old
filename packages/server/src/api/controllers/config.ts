import { Request } from "utils";
import * as ConfigDAL from "../../dal/config";
import { IronTimerResponse } from "../../utils/irontimer-response";

export async function getConfig(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const config = await ConfigDAL.getConfig(uid);

  return new IronTimerResponse("Configuration retrieved", config);
}

export async function saveConfig(req: Request): Promise<IronTimerResponse> {
  const { config } = req.body;
  const { uid } = req.ctx.decodedToken;

  await ConfigDAL.saveConfig(uid, config);

  return new IronTimerResponse("Config updated");
}
