import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase-config";
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";

initializeApp(firebaseConfig);

export const auth = getAuth();

export async function signUp(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

auth.onAuthStateChanged((user) => {
  if (user !== null) {
    console.log("user logged in");
  } else {
    console.log("user logged out");
  }

  return user;
});
