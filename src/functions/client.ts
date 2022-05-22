import { Result, User } from "../types/types";
import { getIdToken } from "firebase/auth";
import { auth } from "./auth";

const backendURI =
  window.location.hostname === "localhost"
    ? "http://localhost:3005"
    : "http://api.irontimer.com:3005";

export async function createUser(
  email: string,
  username: string,
  userID: string
): Promise<User | undefined> {
  const idToken = auth.currentUser && (await getIdToken(auth.currentUser));

  const response = await fetch(`${backendURI}/users`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...(idToken && { Authorization: `Bearer ${idToken}` })
    },
    body: JSON.stringify({
      email,
      username,
      userID
    })
  }).catch((err) => {
    console.error(err);

    return undefined;
  });

  if (response === undefined) {
    return undefined;
  }

  const user = (await response.json()) as User;

  return user;
}

export async function saveResult(
  userID: string,
  result: Result
): Promise<void> {
  const idToken = auth.currentUser && (await getIdToken(auth.currentUser));

  await fetch(`${backendURI}/results`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...(idToken && { Authorization: `Bearer ${idToken}` })
    },
    body: JSON.stringify({
      userID,
      result
    })
  }).catch((err) => {
    console.error(err);
  });
}

export async function getResults(
  userID: string
): Promise<Result[] | undefined> {
  const idToken = auth.currentUser && (await getIdToken(auth.currentUser));

  const response = await fetch(
    `${backendURI}/results?${new URLSearchParams({
      userID
    })}`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...(idToken && { Authorization: `Bearer ${idToken}` })
      }
    }
  ).catch((err) => {
    console.error(err);

    return undefined;
  });

  if (response === undefined) {
    return undefined;
  }

  const results = (await response.json()) as Result[];

  return results;
}
