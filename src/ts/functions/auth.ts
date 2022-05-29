import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebase-config";
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import API from "../api-client";
import { setResults } from "../state/result";
import { Config, Result, Saved, Session } from "../../types";
import { config, getConfigChange, setConfig } from "../state/config";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import { addNotification } from "../state/notifications";
import { createEffect } from "solid-js";
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
    addNotification({
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
    addNotification({
      type: "error",
      message: `Failed to get config\n${response.message}`
    });

    return;
  }

  let config = response.data as Saved<Config, string> | null;

  if (config === null) {
    const saveResponse = await API.configs.save(DEFAULT_CONFIG);

    if (saveResponse.status !== 200) {
      addNotification({
        type: "error",
        message: `Failed to save config\n${saveResponse.message}`
      });

      return;
    }

    config = saveResponse.data as Saved<Config, string> | null;
  }

  if (config?._id !== user.uid) {
    return;
  }

  setConfig(config);
}

async function getSessionsFromDatabase(): Promise<void> {
  const response = await API.sessions.get();

  if (response.status !== 200) {
    addNotification({
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
    }
  } else {
    setCurrentSession(currentSession);
  }

  setSessions(sessions);
}

createEffect(() => {
  getConfigChange();

  if (auth.currentUser !== null) {
    API.configs.save(config);
  }
});
