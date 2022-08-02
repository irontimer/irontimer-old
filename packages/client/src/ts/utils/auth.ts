import { initializeApp } from "firebase/app";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";
import { DEFAULT_CONFIG } from "utils";
// eslint-disable-next-line
// @ts-ignore
import { firebaseConfig } from "../../config/firebase-config";
import API from "../api-client";
import { config, setConfig, _setConfig } from "../state/config";
import Notifications from "../state/notifications";
import { setCurrentSession, setSessions } from "../state/session";
import { setIsSavingSolve, setSolves } from "../state/solve";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export async function signIn(
  email: string,
  password: string
): Promise<User | undefined> {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((err) => {
    console.log(err);

    Notifications.add({
      type: "error",
      message: `Error signing in\n${err.code}\n${err.message}`
    });

    return undefined;
  });

  return credential?.user;
}

export async function signUp(
  email: string,
  username: string,
  password: string,
  confirmPassword: string
): Promise<User | undefined> {
  if (password !== confirmPassword) {
    Notifications.add({
      type: "error",
      message: "Passwords do not match"
    });

    return;
  }

  const isValid = await API.users.getNameAvailability(username);

  if (isValid.status !== 200) {
    Notifications.add({
      type: "error",
      message: "Username is invalid or already taken"
    });

    return;
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((err) => {
    console.log(err);

    Notifications.add({
      type: "error",
      message: `Failed to sign up\n${err.message}`
    });

    return undefined;
  });

  const user = credential?.user;

  if (user === undefined) {
    Notifications.add({
      type: "error",
      message: "Something went wrong"
    });

    return;
  }

  const response = await API.users.create(user.uid, username, email);

  if (response.status !== 200) {
    Notifications.add({
      type: "error",
      message: "Something went wrong"
    });

    return;
  }

  return user;
}

auth.onAuthStateChanged(async (user) => {
  if (user !== null) {
    console.log("user logged in");

    setIsSavingSolve(true);
    await getSolvesFromDatabase();
    await getConfigFromDatabase(user);
    await getSessionsFromDatabase();
    setIsSavingSolve(false);

    if (window.location.pathname === "/sign-in") {
      window.location.replace("/");

      return;
    }
  } else {
    console.log("user logged out");

    if (window.location.pathname === "/account") {
      window.location.replace("/sign-in");

      return;
    }
  }

  return user;
});

async function getSolvesFromDatabase(): Promise<void> {
  const response = await API.solves.get();

  if (response.status !== 200) {
    Notifications.add({
      type: "error",
      message: `Failed to get solves\n${response.message}`
    });

    return;
  }

  const solves = response.data;

  if (solves === undefined) {
    Notifications.add({
      type: "error",
      message: "Something went wrong"
    });

    return;
  }

  setSolves(solves);
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

  let config = response.data;

  if (config === undefined) {
    const saveResponse = await API.configs.save(DEFAULT_CONFIG);

    if (saveResponse.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to save config\n${saveResponse.message}`
      });

      return;
    }

    const newResponse = await API.configs.get();

    if (newResponse.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to get config\n${newResponse.message}`
      });

      return;
    }

    const newConfig = newResponse.data;

    if (newConfig === undefined) {
      Notifications.add({
        type: "error",
        message: "Something went wrong"
      });

      return;
    }

    config = newConfig;
  }

  if (config._id !== user.uid) {
    Notifications.add({
      type: "error",
      message: "Config does not belong to user"
    });

    return;
  }

  _setConfig(config);
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

  const sessions = response.data;

  if (sessions === undefined) {
    Notifications.add({
      type: "error",
      message: "Something went wrong"
    });

    return;
  }

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

      const session = response.data;

      if (session === undefined) {
        Notifications.add({
          type: "error",
          message: "Something went wrong"
        });

        return;
      }

      setSessions([session]);

      setCurrentSession(session);
    }
  } else {
    setCurrentSession(currentSession);
  }

  setSessions(sessions);
}
