import { Component, createSignal } from "solid-js";
import { formatTime } from "../utils/misc";
import { config } from "../state/config";
import { addResult, getLastResult } from "../state/result";

type ReadyState = "unready" | "almost-ready" | "ready" | "running";

const [getPreviousTimestamp, setPreviousTimestamp] = createSignal(0);
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
  if (config.timerType !== "timer") {
    return;
  }

  if (isKeyboardEvent(e) && e.code !== "Space") {
    return;
  }

  e.preventDefault();

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
      setPreviousTimestamp(getCurrentDifference());
      addResult(getCurrentDifference() / 1000);

      setTimestamp(0);

      setIsTiming(false);
      setAnimationFrame(0);

      setReadyState("unready");

      break;
  }
}

function release(e: KeyboardEvent | TouchEvent): void {
  if (config.timerType !== "timer") {
    return;
  }

  if (isKeyboardEvent(e) && e.code !== "Space") {
    return;
  }

  e.preventDefault();

  switch (getReadyState()) {
    case "unready":
      setTimestamp(0);

      break;

    case "almost-ready":
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
    return formatTime(
      (getPreviousTimestamp() / 1000 || getLastResult()?.time) ?? 0
    );
  }

  return formatTime(getCurrentDifference() / 1000);
}

function isKeyboardEvent(e: KeyboardEvent | TouchEvent): e is KeyboardEvent {
  return (e as KeyboardEvent).code !== undefined;
}

document.addEventListener("keydown", press);
document.addEventListener("touchstart", press);
document.addEventListener("keyup", release);
document.addEventListener("touchend", release);
