import API from "../api-client";
import { createSignal } from "solid-js";
import { Saved, Session } from "../../types";
import { auth } from "../functions/auth";
import { addNotification } from "./notifications";
import { ScrambleType } from "../../constants/scramble-type";
import { createStore } from "solid-js/store";

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
  scrambleType: ScrambleType
): Promise<void> {
  const unsavedSession: Session = {
    name,
    scrambleType
  };

  if (auth.currentUser !== null) {
    const response = await API.sessions.add(unsavedSession);

    if (response.status === 200) {
      const session = response.data as Saved<Session>;

      setSessions([...getSessions(), session]);
    } else {
      addNotification({
        type: "error",
        message: "Failed to add session"
      });
    }
  } else {
    setSessions([...getSessions(), unsavedSession]);
  }
}
