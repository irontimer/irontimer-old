import type { Session, Unsaved } from "utils";
import prisma from "../init/db";

export async function getSessions(uid: string): Promise<Session[]> {
  return await prisma.session.findMany({ where: { uid } });
}

export async function getSession(
  uid: string,
  sessionId: string
): Promise<Session | undefined> {
  return (
    (await prisma.session.findFirst({ where: { uid, id: sessionId } })) ??
    undefined
  );
}

export async function addSession(session: Unsaved<Session>): Promise<Session> {
  const newSession = await prisma.session.create({
    data: session
  });

  return newSession;
}

export async function deleteAll(uid: string): Promise<void> {
  await prisma.session.deleteMany({ where: { uid } });
}

export async function deleteSession(id: string): Promise<string | undefined> {
  return (await prisma.session.delete({ where: { id } })).id;
}
