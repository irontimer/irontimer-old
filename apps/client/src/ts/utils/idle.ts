import { createEffect, createSignal, on } from "solid-js";
import API from "../api-client";

// store the last time the user was active
const [getPreviousLastActive, setPreviousLastActive] = createSignal(Date.now());
const [getLastActive, setLastActive] = createSignal(Date.now());

createEffect(
  on(getLastActive, (lastActive) => {
    if (lastActive - getPreviousLastActive() > 30 * 60 * 1000) {
      API.utils
        .ping()
        .then(() => console.log("Pinged server"))
        .catch(() => console.log("Error pinging server"));
    }
  })
);

// add events
function resetIdleTimer(): void {
  setPreviousLastActive(getLastActive());

  setLastActive(Date.now());
}

document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keydown", resetIdleTimer);
