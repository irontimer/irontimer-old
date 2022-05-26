import { Component, createSignal } from "solid-js";
import { formatTime } from "../functions/time";
import { addResult } from "../state/result";
import "./TimerStopwatch.scss";

type ReadyState = "unready" | "almost-ready" | "ready" | "running";

const [getPreviousTime, setPreviousTime] = createSignal(0);
const [getTimestamp, setTimestamp] = createSignal(0);
const [getAnimationFrame, setAnimationFrame] = createSignal(0);
export const [getIsAnimating, setIsAnimating] = createSignal(false);
const [getReadyState, setReadyState] = createSignal<ReadyState>("unready");

const getCurrentDifference = (): number => Date.now() - getTimestamp();

export const TimerStopwatch: Component = () => {
  return (
    <div class={`timer-stopwatch ${getReadyState()}`}>{getCurrentTime()}</div>
  );
};

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") {
    return;
  }

  switch (getReadyState()) {
    case "unready":
      setTimestamp(Date.now());

      setReadyState("almost-ready");

      break;

    case "almost-ready":
      if (getCurrentDifference() < 1000) {
        break;
      }

      setTimestamp(0);

      setReadyState("ready");

      break;

    case "ready":
      break;

    case "running":
      setPreviousTime(getCurrentDifference());

      addResult(getPreviousTime() / 1000);

      setTimestamp(0);

      setIsAnimating(false);
      setAnimationFrame(0);

      setReadyState("unready");

      break;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code !== "Space") {
    return;
  }

  switch (getReadyState()) {
    case "unready":
      break;

    case "almost-ready":
      break;

    case "ready":
      setTimestamp(Date.now());

      setIsAnimating(true);

      setReadyState("running");
      break;

    case "running":
      setTimestamp(0);

      setIsAnimating(false);
      setAnimationFrame(0);

      setReadyState("unready");
      break;
  }
});

function animationLoop(): void {
  if (getReadyState() !== "running") {
    cancelAnimationFrame(getAnimationFrame());

    return;
  }

  setAnimationFrame(requestAnimationFrame(animationLoop));
}

function getCurrentTime(): string {
  getAnimationFrame();

  if (getReadyState() === "running") {
    if (getAnimationFrame() === 0 && getIsAnimating()) {
      animationLoop();
    }
  } else {
    return formatTime(getPreviousTime() / 1000);
  }

  return formatTime(getCurrentDifference() / 1000);
}