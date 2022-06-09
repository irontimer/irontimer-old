import API from "../api-client";
import { createSignal } from "solid-js";
import { Saved, Session } from "../../types";
import Notifications from "./notifications";
import { ScrambleType } from "../../constants/scramble-type";
import { createStore } from "solid-js/store";
import { User } from "firebase/auth";

export const [getSessions, setSessions] = createSignal<
  Session[] | Saved<Session>[]
>([]);

export const [currentSession, setCurrentSession] = createStore<
  Session | Saved<Session>
>({
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
