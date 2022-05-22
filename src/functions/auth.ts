import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase-config";
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import { getResults } from "./client";
import { setResults } from "../state/result";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export async function signUp(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
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

    const results = await getResults(user.uid);

    if (results === undefined) {
      return;
    }

    setResults(results);
  } else {
    console.log("user logged out");

    if (window.location.pathname === "/account") {
      window.location.replace("/sign-in");

      return;
    }
  }

  return user;
});
