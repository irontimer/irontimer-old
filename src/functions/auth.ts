import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase-config";
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import API from "../api-client";
import { setResults } from "../state/result";
import { SavedConfig, SavedResult } from "../types";
import { setConfig } from "../state/config";
import { DEFAULT_CONFIG } from "../constants/default-config";

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

    getResultsFromDatabase();
    getConfigFromDatabase(user);
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

  const results = response.data as SavedResult[];

  setResults(results);
}

async function getConfigFromDatabase(user: User): Promise<void> {
  const response = await API.configs.get();

  let config = response.data as SavedConfig | null;

  if (config === null) {
    const saveResponse = await API.configs.save(DEFAULT_CONFIG);

    config = saveResponse.data as SavedConfig | null;
  }

  if (config?._id !== user.uid) {
    return;
  }

  setConfig(config);
}
