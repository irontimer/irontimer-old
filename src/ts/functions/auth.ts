import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase-config";
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import API from "../api-client";
import { setResults } from "../state/result";
import { Config, Result, Saved, Session } from "../../types";
import { config, setConfig } from "../state/config";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import Notifications from "../state/notifications";
import { setCurrentSession, setSessions } from "../state/session";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export async function signUp(
  email: string,
  password: string
): Promise<User | undefined> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((err) => {
    console.log(err);

    return undefined;
  });

  return credential?.user;
}

auth.onAuthStateChanged(async (user) => {
  if (user !== null) {
    console.log("user logged in");

    const user = auth.currentUser;

    if (user === null) {
      return;
    }

    if (window.location.pathname === "/sign-in") {
      window.location.replace("/");

      return;
    }

    await getResultsFromDatabase();
    await getConfigFromDatabase(user);
    await getSessionsFromDatabase();
  } else {
    console.log("user logged out");

    if (window.location.pathname === "/account") {
      window.location.replace("/sign-in");

      return;
    }
  }

  return user;
});

async function getResultsFromDatabase(): Promise<void> {
  const response = await API.results.get();

  if (response.status !== 200) {
    Notifications.add({
      type: "error",
      message: `Failed to get results\n${response.message}`
    });

    return;
  }

  const results = response.data as Saved<Result>[];

  setResults(results);
}

async function getConfigFromDatabase(user: User): Promise<void> {
  const response = await API.configs.get();

  if (response.status !== 200) {
    Notifications.add({
      type: "error",
      message: `Failed to get config\n${response.message}`
    });

    return;
  }

  let config = response.data as Saved<Config, string> | null;

  if (config === null) {
    const saveResponse = await API.configs.save(DEFAULT_CONFIG);

    if (saveResponse.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to save config\n${saveResponse.message}`
      });

      return;
    }

    config = saveResponse.data as Saved<Config, string> | null;
  }

  if (config?._id !== user.uid) {
    Notifications.add({
      type: "error",
      message: "Config does not belong to user"
    });

    return;
  }

  setConfig(config);
}

async function getSessionsFromDatabase(): Promise<void> {
  const response = await API.sessions.get();

  if (response.status !== 200) {
    Notifications.add({
      type: "error",
      message: `Failed to get sessions\n${response.message}`
    });

    return;
  }

  const sessions = response.data as Saved<Session>[];

  const currentSession = sessions.find(
    (session) => config.currentSession === session.name
  );

  if (currentSession === undefined) {
    if (sessions.length > 0) {
      setCurrentSession(sessions[0]);

      setConfig("currentSession", sessions[0].name);
    } else {
      const response = await API.sessions.add({
        name: "Default",
        scrambleType: "3x3x3"
      });

      if (response.status !== 200) {
        Notifications.add({
          type: "error",
          message: `Failed to add session\n${response.message}`
        });

        return;
      }

      const session = response.data as Saved<Session>;

      setSessions([session]);

      setCurrentSession(session);
    }
  } else {
    setCurrentSession(currentSession);
  }

  setSessions(sessions);
}
