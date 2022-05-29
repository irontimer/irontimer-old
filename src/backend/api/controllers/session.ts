import { AlmostSaved, Request, Session } from "../../../types";
import * as SessionDAL from "../../dal/session";
import IronTimerError from "../../utils/error";
import { IronTimerResponse } from "../../utils/irontimer-response";

export async function getSessions(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  const sessions = await SessionDAL.getSessions(userID);

  return new IronTimerResponse("Sessions retrieved", sessions);
}

export async function addSession(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;
  const { session: sessionBody } = req.body;

  const session: AlmostSaved<Session> = Object.assign({}, sessionBody);

  session.userID = userID;

  const sessionID = await SessionDAL.addSession(session);

  return new IronTimerResponse("Session added", sessionID);
}

export async function deleteAll(req: Request): Promise<IronTimerResponse> {
  const { userID } = req.ctx.decodedToken;

  await SessionDAL.deleteAll(userID);

  return new IronTimerResponse("Sessions deleted");
}

export async function deleteSession(req: Request): Promise<IronTimerResponse> {
  const { _id } = req.params;

  if (typeof _id !== "string") {
    throw new IronTimerError(400, "Invalid session ID");
  }

  await SessionDAL.deleteSession(_id);

  return new IronTimerResponse("Session deleted");
}
