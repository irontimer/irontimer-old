import { Component, createEffect, createSignal, Show } from "solid-js";
import { Stackmat } from "stackmat";
import { config } from "../../state/config";
import { addSolve } from "../../state/solve";
import { setIsTiming } from "../../state/timing";
import { auth } from "../../utils/auth";
import { c, formatTime } from "../../utils/misc";

type StackmatState = "unready" | "almost-ready" | "ready" | "running";

export const TimerStackmat: Component = () => {
  const [getState, setState] = createSignal<StackmatState>("unready");
  const [getTime, setTime] = createSignal<number | undefined>();

  const stackmat = new Stackmat();

  // https://github.com/stilesdev/stackmat/issues/13
  // this is the reason we aren't using all the events

  stackmat.on("reset", () => {
    setState("unready");

    setIsTiming(false);

    if (getTime()) {
      addSolve(getTime() as number, auth.currentUser);
    }
  });
  // stackmat.on("stopped", () => setState("unready"));
  // stackmat.on("unready", () => setState("unready"));
  // stackmat.on("starting", () => setState("almost-ready"));
  // stackmat.on("ready", () => setState("ready"));
  stackmat.on("started", () => {
    setState("running");

    setIsTiming(true);
  });

  stackmat.on("packetReceived", (p) => setTime(p.timeInMilliseconds / 1000));
  stackmat.on("timerConnected", () => setTime(0));
  stackmat.on("timerDisconnected", () => setTime());

  createEffect(() => {
    if (config.timerType === "stackmat") {
      stackmat.start();
    } else {
      stackmat.stop();
    }
  });

  return (
    <div class={c("timer-stackmat", "unselectable", getState())}>
      <Show when={getTime() !== undefined} fallback="--:--.--">
        {formatTime(getTime() as number)}
      </Show>
    </div>
  );
};
