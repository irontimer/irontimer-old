import { Types } from "mongoose";
import type { Session as ISession, Saved, AlmostSaved } from "../../types";
import { Session } from "../models/session";

export async function getSessions(userID: string): Promise<Saved<ISession>[]> {
  return await Session.find({ userID });
}

export async function getSession(
  userID: string,
  sessionName: string
): Promise<Saved<ISession> | undefined> {
  return (await Session.findOne({ userID, name: sessionName })) ?? undefined;
}

export async function addSession(
  session: AlmostSaved<ISession>
): Promise<Saved<ISession>> {
  const _id = new Types.ObjectId();

  const newSession = await Session.create({ ...session, _id });

  return newSession;
}

export async function deleteAll(userID: string): Promise<void> {
  await Session.deleteMany({ userID });
}

export async function deleteSession(
  _id: string
): Promise<Types.ObjectId | undefined> {
  const id = new Types.ObjectId(_id);

  return (await Session.findByIdAndDelete(id))?._id;
}
