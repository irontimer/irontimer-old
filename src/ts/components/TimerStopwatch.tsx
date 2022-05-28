import { Component, createSignal } from "solid-js";
import { formatTime } from "../functions/time";
import { addResult } from "../state/result";

type ReadyState = "unready" | "almost-ready" | "ready" | "running";

const [getPreviousTime, setPreviousTime] = createSignal(0);
const [getTimestamp, setTimestamp] = createSignal(0);
const [getAnimationFrame, setAnimationFrame] = createSignal(0);
const [getReadyState, setReadyState] = createSignal<ReadyState>("unready");
export const [isTiming, setIsTiming] = createSignal(false);

export const TimerStopwatch: Component = () => {
  return (
    <div class={`timer-stopwatch unselectable ${getReadyState()}`}>
      {getCurrentTime()}
    </div>
  );
};

function getCurrentDifference(): number {
  return Date.now() - getTimestamp();
}

function press(e: KeyboardEvent | TouchEvent): void {
  if (isKeyboardEvent(e)) {
    if (e.code !== "Space") {
      return;
    }
  }

  switch (getReadyState()) {
    case "unready":
      setTimestamp(Date.now());

      setReadyState("almost-ready");

      break;

    case "almost-ready":
      if (getCurrentDifference() < 500) {
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

      setIsTiming(false);
      setAnimationFrame(0);

      setReadyState("unready");

      break;
  }
}

function release(e: KeyboardEvent | TouchEvent): void {
  if (isKeyboardEvent(e)) {
    if (e.code !== "Space") {
      return;
    }
  }

  switch (getReadyState()) {
    case "unready":
      break;

    case "almost-ready":
      setTimestamp(0);

      setReadyState("unready");
      break;

    case "ready":
      setTimestamp(Date.now());

      setIsTiming(true);

      setReadyState("running");
      break;

    case "running":
      setTimestamp(0);

      setIsTiming(false);
      setAnimationFrame(0);

      setReadyState("unready");
      break;
  }
}

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
    if (getAnimationFrame() === 0 && isTiming()) {
      animationLoop();
    }
  } else {
    return formatTime(getPreviousTime() / 1000);
  }

  return formatTime(getCurrentDifference() / 1000);
}

function isKeyboardEvent(e: KeyboardEvent | TouchEvent): e is KeyboardEvent {
  return (e as KeyboardEvent).code !== undefined;
}

// Keyboard
document.addEventListener("keydown", press);
document.addEventListener("keyup", release);

// Touchscreen
document.addEventListener("touchstart", press);
document.addEventListener("touchend", release);
