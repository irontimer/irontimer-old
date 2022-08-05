import type { User } from "firebase/auth";
import { createSignal } from "solid-js";
import { Saved, ScrambleType, Session } from "utils";
import API from "../api-client";
import { createReactiveStore } from "../utils/reactive-store";
import Notifications from "./notifications";

export const [getSessions, setSessions] = createSignal<
  Session[] | Saved<Session>[]
>([]);

export function getSessionsByNames(): string[] {
  return getSessions().map((s) => s.name);
}

export const [
  currentSession,
  setCurrentSession,
  getCurrentSessionChange,
  _setCurrentSession
] = createReactiveStore<Session | Saved<Session>>({
  name: "Default",
  scrambleType: "3x3x3"
});

export async function addSession(
  name: string,
  scrambleType: ScrambleType,
  user: User | null
): Promise<void> {
  const unsavedSession: Session = {
    name,
    scrambleType
  };

  if (user !== null) {
    const response = await API.sessions.add(unsavedSession);

    if (response.status === 200) {
      const session = response.data;

      if (session === undefined) {
        throw new Error("Session was not added");
      }

      setSessions([...getSessions(), session]);
    } else {
      Notifications.add({
        type: "error",
        message: "Failed to add session"
      });
    }
  } else {
    setSessions([...getSessions(), unsavedSession]);
  }
}
