import { Component, createSignal, For, Match, Show, Switch } from "solid-js";
import { Popup } from "../components/Popup";
import { actualTimeString, calculateAverageString } from "../utils/misc";
import {
  deleteAll,
  deleteResult,
  getResults,
  getResultsDescending,
  getResultsAscending,
  updateResult,
  getLastResult
} from "../state/result";
import { Result, Penalty, Saved } from "../../types";

import { Button } from "../components/Button";
import { isTiming, TimerStopwatch } from "../components/TimerStopwatch";
import { config } from "../state/config";
import { TimerInput } from "../components/TimerInput";
import Notifications from "../state/notifications";
import { currentSession } from "../state/session";
import { auth } from "../utils/auth";

const [getCurrentOpen, setCurrentOpen] = createSignal<number | undefined>();

function getResultFromCurrentOpen(): Saved<Result> | Result | undefined {
  return getResultsAscending()[(getCurrentOpen() ?? 0) - 1];
}

const averages = [5, 12, 50, 100, 200, 500, 1000]; // TODO use a config setting

function getAllAverages(): { averageOf: number; average: string }[] {
  return averages
    .filter((n) => n <= getResults().length)
    .map((n) => ({
      averageOf: n,
      average: calculateAverageString(getResultsDescending().slice(0, n))
    }));
}

function popupButtonCallback(
  cb: (result: Saved<Result> | Result) => void,
  close = false
): void {
  const result = getResultFromCurrentOpen();

  if (result === undefined) {
    return;
  }

  cb(result);

  if (close) {
    setCurrentOpen();
  }
}

export const Timer: Component = () => {
  return (
    <div class="timer-page">
      <div id="left">
        <Show when={!isTiming()} fallback={<div></div>}>
          <div id="results">
            <h1 class="unselectable">{currentSession.name}</h1>
            <Button
              class="clear-results-button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all results in this session?"
                  )
                ) {
                  deleteAll(auth.currentUser);

                  Notifications.add({
                    type: "success",
                    message: "All results have been deleted",
                    duration: 5000
                  });
                }
              }}
            >
              Clear
            </Button>
            <Popup
              isOpen={[
                () => getCurrentOpen() !== undefined,
                (isOpen) => !isOpen && setCurrentOpen()
              ]}
              id="result-popup"
              wrapperID="result-popup-wrapper"
            >
              <div class="popup-content">
                <div class="popup-title">Result #{getCurrentOpen()}</div>
                <div class="popup-buttons">
                  <i
                    class="popup-button fas fa-trash"
                    onClick={() =>
                      popupButtonCallback(
                        (result) => deleteResult(result, auth.currentUser),
                        true
                      )
                    }
                  />
                </div>
                <div class="popup-content">
                  Time: {actualTimeString(getResultFromCurrentOpen())}
                </div>
                <div class="popup-content">
                  Date:{" "}
                  {new Date(
                    getResultFromCurrentOpen()?.timestamp ?? 0
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

                      popupButtonCallback((result) => {
                        updateResult(result, { penalty }, auth.currentUser);
                      });
                    }}
                  >
                    <For each={["OK", "+2", "DNF"]}>
                      {(penalty) => (
                        <option
                          selected={
                            getResultFromCurrentOpen()?.penalty === penalty
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
                    value={getResultFromCurrentOpen()?.scramble}
                  />
                  <i
                    class="popup-copy-button fa-solid fa-clipboard-list"
                    onClick={() => {
                      // copy scramble to clipboard
                      navigator.clipboard.writeText(
                        getResultFromCurrentOpen()?.scramble ?? ""
                      );

                      Notifications.add({
                        type: "success",
                        message: "Copied scramble to clipboard",
                        duration: 5000
                      });
                    }}
                  ></i>
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
                <For each={getResultsDescending()}>
                  {(result, getIndex) => {
                    {
                      const [ao5, ao12] = [5, 12].map((n) => {
                        const results = getResultsDescending().slice(
                          getIndex(),
                          getIndex() + n
                        );

                        if (results.length !== n) {
                          return;
                        }

                        return calculateAverageString(results);
                      });

                      return (
                        <>
                          <tr>
                            <td
                              class="unselectable"
                              onClick={() =>
                                setCurrentOpen(getResults().length - getIndex())
                              }
                            >
                              {getResults().length - getIndex()}
                            </td>
                            <td
                              class="unselectable"
                              onClick={() =>
                                setCurrentOpen(getResults().length - getIndex())
                              }
                            >
                              {actualTimeString(result)}
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

      <div id="center">
        <div class="spacer" />
        <Switch fallback={<TimerStopwatch />}>
          <Match when={config.timerType === "timer"}>
            <TimerStopwatch />
          </Match>
          <Match when={config.timerType === "typing"}>
            <TimerInput />
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
  const lastResult = getLastResult();

  if (lastResult === undefined) {
    return;
  }

  if (e.ctrlKey) {
    switch (e.key) {
      case "1":
        if (lastResult.penalty !== "OK") {
          updateResult(lastResult, { penalty: "OK" }, auth.currentUser);
        }

        break;

      case "2":
        if (lastResult.penalty !== "+2") {
          updateResult(lastResult, { penalty: "+2" }, auth.currentUser);
        }

        break;

      case "3":
        if (lastResult.penalty !== "DNF") {
          updateResult(lastResult, { penalty: "DNF" }, auth.currentUser);
        }

        break;
    }
  }
});
