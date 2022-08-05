import { Request, Session, Unsaved } from "utils";
import * as SessionDAL from "../../dal/session";
import IronTimerError from "../../utils/error";
import { IronTimerResponse } from "../../utils/irontimer-response";

export async function getSessions(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  const sessions = await SessionDAL.getSessions(uid);

  return new IronTimerResponse("Sessions retrieved", sessions);
}

export async function addSession(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;
  const { session: sessionBody } = req.body;

  const session: Unsaved<Session> = Object.assign({}, sessionBody);

  session.uid = uid;

  const newSession = await SessionDAL.addSession(session);

  return new IronTimerResponse("Session added", newSession);
}

export async function deleteSession(req: Request): Promise<IronTimerResponse> {
  const { _id } = req.params;

  if (typeof _id !== "string") {
    throw new IronTimerError(400, "Invalid session Id");
  }

  await SessionDAL.deleteSession(_id);

  return new IronTimerResponse("Session deleted");
}

export async function deleteAll(req: Request): Promise<IronTimerResponse> {
  const { uid } = req.ctx.decodedToken;

  await SessionDAL.deleteAll(uid);

  return new IronTimerResponse("Sessions deleted");
}
