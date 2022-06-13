import { Component, createSignal, Show } from "solid-js";
import { Stackmat } from "stackmat";
import { addSolve } from "../../state/solve";
import { auth } from "../../utils/auth";
import { formatTime } from "../../utils/misc";
import { setIsTiming } from "../../state/timing";

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

    if (getTime() !== undefined && getTime() !== 0) {
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

  stackmat.start();

  return (
    <div class={`timer-stackmat unselectable ${getState()}`}>
      <Show when={getTime() !== undefined} fallback="--:--.--">
        {formatTime(getTime() as number)}
      </Show>
    </div>
  );
};
