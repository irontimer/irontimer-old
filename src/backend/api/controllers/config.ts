import * as ConfigDAL from "../../dal/config";
import { IronTimerResponse } from "../../utils/irontimer-response";
import { Request } from "../../../types";

export async function getConfig(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const data = await ConfigDAL.getConfig(userID);
  return new IronTimerResponse("Configuration retrieved", data);
}

export async function saveConfig(req: Request): Promise<IronTimerResponse> {
  const { config } = req.body;
  const { userID } = req.ctx.decodedToken;

  await ConfigDAL.saveConfig(userID, config);

  return new IronTimerResponse("Config updated");
}
