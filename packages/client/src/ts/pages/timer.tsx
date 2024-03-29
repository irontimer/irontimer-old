import { Component, createSignal, For, Match, Show, Switch } from "solid-js";
import { Penalty, Saved, Solve } from "utils";
import { Popup } from "../components/popup";
import {
  deleteAll,
  deleteSolve,
  getLastSolve,
  getSolves,
  getSolvesAscending,
  getSolvesDescending,
  updateSolve
} from "../state/solve";
import { actualTimeString, calculateAverageString } from "../utils/misc";

import { Button } from "../components/button";
import { Icon } from "../components/icon";
import { TimerInput } from "../components/timer/input";
import { TimerStackmat } from "../components/timer/stackmat";
import { press, release, TimerStopwatch } from "../components/timer/stopwatch";
import { config } from "../state/config";
import Notifications from "../state/notifications";
import { currentSession } from "../state/session";
import { isTiming } from "../state/timing";
import { auth } from "../utils/auth";

document.addEventListener("keydown", press);
document.addEventListener("keyup", release);

const [getCurrentOpenSolve, setCurrentOpenSolve] = createSignal<
  number | undefined
>();

function getSolveFromCurrentOpen(): Saved<Solve> | Solve | undefined {
  return getSolvesAscending()[(getCurrentOpenSolve() ?? 0) - 1];
}

function getAllAverages(): { averageOf: number; average: string }[] {
  return config.displayAverages
    .filter((n) => n <= getSolves().length)
    .map((n) => ({
      averageOf: n,
      average: calculateAverageString(getSolvesDescending().slice(0, n))
    }));
}

function popupButtonCallback(
  cb: (solve: Saved<Solve> | Solve) => void,
  close = false
): void {
  const solve = getSolveFromCurrentOpen();

  if (solve === undefined) {
    return;
  }

  cb(solve);

  if (close) {
    setCurrentOpenSolve();
  }
}

export const Timer: Component = () => {
  return (
    <div class="timer-page">
      <div id="left">
        <Show when={!isTiming()} fallback={<div></div>}>
          <div id="solves">
            <h1 class="unselectable">{currentSession.name}</h1>
            <Button
              class="clear-solves-button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all solves in this session?"
                  )
                ) {
                  deleteAll(auth.currentUser);

                  Notifications.add({
                    type: "success",
                    message: "All solves have been deleted",
                    duration: 5000
                  });
                }
              }}
            >
              Clear Solves
            </Button>
            <Popup
              isOpen={[
                () => getCurrentOpenSolve() !== undefined,
                (isOpen) => !isOpen && setCurrentOpenSolve()
              ]}
              id="solve-popup"
            >
              <div class="popup-content">
                <div class="popup-title">Solve #{getCurrentOpenSolve()}</div>
                <div class="popup-buttons">
                  <Icon
                    class="popup-button"
                    icon="trash"
                    onClick={() =>
                      popupButtonCallback(
                        (solve) => deleteSolve(solve, auth.currentUser),
                        true
                      )
                    }
                  />
                </div>
                <div class="popup-content">
                  Time: {actualTimeString(getSolveFromCurrentOpen())}
                </div>
                <div class="popup-content">
                  Date:{" "}
                  {new Date(
                    getSolveFromCurrentOpen()?.timestamp ?? 0
                  ).toLocaleDateString()}
                </div>
                <div class="popup-content">Session: {currentSession.name}</div>
                <div class="popup-content">
                  Scramble Type: {currentSession.scrambleType}
                </div>
                <div class="popup-content">
                  Penalty:
                  <select
                    class="popup-content"
                    onChange={(e) => {
                      const penalty = e.currentTarget.value as
                        | Penalty
                        | undefined;

                      if (penalty === undefined) {
                        return;
                      }

                      popupButtonCallback((solve) => {
                        updateSolve(solve, { penalty }, auth.currentUser);
                      });
                    }}
                  >
                    <For each={["OK", "+2", "DNF"]}>
                      {(penalty) => (
                        <option
                          selected={
                            getSolveFromCurrentOpen()?.penalty === penalty
                          }
                        >
                          {penalty}
                        </option>
                      )}
                    </For>
                  </select>
                </div>
                <div class="popup-content">
                  Scramble:
                  <input
                    readonly
                    class="popup-content"
                    value={getSolveFromCurrentOpen()?.scramble}
                  />
                  <Icon
                    icon="clipboard-list"
                    class="popup-copy-button"
                    onClick={() => {
                      // copy scramble to clipboard
                      const scramble = getSolveFromCurrentOpen()?.scramble;

                      if (scramble === undefined || scramble === "") {
                        Notifications.add({
                          type: "error",
                          message: "Unable to copy scramble",
                          duration: 5000
                        });

                        return;
                      }

                      navigator.clipboard.writeText(scramble);

                      Notifications.add({
                        type: "success",
                        message: "Copied scramble to clipboard",
                        duration: 5000
                      });
                    }}
                  />
                </div>
              </div>
            </Popup>
            <table>
              <thead>
                <tr>
                  <td class="unselectable">#</td>
                  <td class="unselectable">Time</td>
                  <td class="unselectable">ao5</td>
                  <td class="unselectable">ao12</td>
                </tr>
              </thead>
              <tbody>
                <For each={getSolvesDescending()}>
                  {(solve, getIndex) => {
                    {
                      const [ao5, ao12] = [5, 12].map((n) => {
                        const solves = getSolvesDescending().slice(
                          getIndex(),
                          getIndex() + n
                        );

                        if (solves.length !== n) {
                          return;
                        }

                        return calculateAverageString(solves);
                      });

                      return (
                        <>
                          <tr>
                            <td
                              class="unselectable"
                              onClick={() =>
                                setCurrentOpenSolve(
                                  getSolves().length - getIndex()
                                )
                              }
                            >
                              {getSolves().length - getIndex()}
                            </td>
                            <td
                              class="unselectable"
                              onClick={() =>
                                setCurrentOpenSolve(
                                  getSolves().length - getIndex()
                                )
                              }
                            >
                              {actualTimeString(solve)}
                            </td>
                            <td class="unselectable">{ao5 ?? "-"}</td>
                            <td class="unselectable">{ao12 ?? "-"}</td>
                          </tr>
                        </>
                      );
                    }
                  }}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </div>

      <div id="center" onTouchStart={press} onTouchEnd={release}>
        <div class="spacer" />
        <Switch fallback={<TimerStopwatch />}>
          <Match when={config.timerType === "timer"}>
            <TimerStopwatch />
          </Match>
          <Match when={config.timerType === "typing"}>
            <TimerInput />
          </Match>
          <Match when={config.timerType === "stackmat"}>
            <TimerStackmat />
          </Match>
        </Switch>
        <div id="average-list">
          <Show when={!isTiming()}>
            <For each={getAllAverages()}>
              {(avg) => (
                <div class="average-item">
                  <div class="average-label unselectable">
                    ao{avg.averageOf}
                  </div>
                  <div class="average-value unselectable">{avg.average}</div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </div>

      <div id="right"></div>
    </div>
  );
};

document.addEventListener("keydown", (e) => {
  const lastSolve = getLastSolve();

  if (lastSolve === undefined) {
    return;
  }

  if (e.ctrlKey) {
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case "1":
        if (lastSolve.penalty !== "OK") {
          updateSolve(lastSolve, { penalty: "OK" }, auth.currentUser);
        }

        break;

      case "2":
        if (lastSolve.penalty !== "+2") {
          updateSolve(lastSolve, { penalty: "+2" }, auth.currentUser);
        }

        break;

      case "3":
        if (lastSolve.penalty !== "DNF") {
          updateSolve(lastSolve, { penalty: "DNF" }, auth.currentUser);
        }

        break;
    }
  }
});
