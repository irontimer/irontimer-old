import { User } from "../types/types";

const backendURI =
  window.location.hostname === "localhost"
    ? "http://localhost:3005"
    : "http://api.irontimer.com:3005";

export async function createUser(
  email: string,
  username: string,
  userID: string
): Promise<User | undefined> {
  const response = await fetch(`${backendURI}/users`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
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

  const user = await response.json();

  return user;
}
