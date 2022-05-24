import * as PsaDAL from "../../dal/psa";
import { IronTimerResponse } from "../../utils/irontimer-response";

export async function getPsas(): Promise<IronTimerResponse> {
  const data = await PsaDAL.get();
  return new IronTimerResponse("PSAs retrieved", data);
}
