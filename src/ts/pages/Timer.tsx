/** @format */
import { Component, createSignal, Match, Show, Switch } from "solid-js";
import { Popup } from "../components/Popup";
import { calculateAverage } from "../functions/average";
import {
  deleteAll,
  deleteResult,
  getResults,
  getResultsDescending,
  getResultsAscending
} from "../state/result";
import { formatTime } from "../functions/time";
import { Result, Saved } from "../../types";

import { Button } from "../components/Button";
import { isTiming, TimerStopwatch } from "../components/TimerStopwatch";
import { config } from "../state/config";
import { TimerInput } from "../components/TimerInput";
import { addNotification } from "../state/notifications";
import { currentSession } from "../state/session";

export const Timer: Component = () => {
  const [getCurrentOpen, setCurrentOpen] = createSignal<number | undefined>();

  function getResultFromCurrentOpen(): Saved<Result> | Result | undefined {
    return getResultsAscending()[(getCurrentOpen() ?? 0) - 1];
  }

  return (
    <div class="timer-page">
      <Show when={!isTiming()} fallback={<div></div>}>
        <div id="results">
          <h1 class="unselectable">Results</h1>
          <Button
            class="clear-results-button"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete all results?")
              ) {
                deleteAll();

                addNotification({
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
            children={
              <div class="popup-content">
                <div class="popup-title">Result #{getCurrentOpen()}</div>
                <div class="popup-buttons">
                  <i
                    class="fas fa-trash"
                    onClick={() => {
                      const result = getResultFromCurrentOpen();

                      if (result === undefined) {
                        return;
                      }

                      deleteResult(result);

                      setCurrentOpen();
                    }}
                  ></i>
                </div>
                <div class="popup-content">
                  Time: {getResultFromCurrentOpen()?.time}
                </div>
                <div class="popup-content">
                  Date:{" "}
                  {new Date(
                    getResultFromCurrentOpen()?.timestamp ?? 0
                  ).toLocaleDateString()}
                </div>
                <div class="popup-content">
                  Scramble Type: {currentSession.scrambleType}
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

                      addNotification({
                        type: "success",
                        message: "Copied scramble to clipboard",
                        duration: 5000
                      });
                    }}
                  ></i>
                </div>
              </div>
            }
            isOpen={[
              () => getCurrentOpen() !== undefined,
              (isOpen) => !isOpen && setCurrentOpen()
            ]}
            id="result-popup"
            wrapperID="result-popup-wrapper"
          ></Popup>
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
              {getResultsDescending().map((result, index) => {
                const [ao5, ao12] = [5, 12].map((n) => {
                  const results = getResultsDescending().slice(
                    index,
                    index + n
                  );

                  if (results.length !== n) {
                    return;
                  }

                  return calculateAverage(results);
                });

                function onClick(): void {
                  setCurrentOpen(getResults().length - index);
                }

                return (
                  <>
                    <tr>
                      <td class="unselectable" onClick={onClick}>
                        {getResults().length - index}
                      </td>
                      <td class="unselectable" onClick={onClick}>
                        {formatTime(result.time)}
                      </td>
                      <td class="unselectable">
                        {ao5 !== undefined ? formatTime(ao5) : "-"}
                      </td>
                      <td class="unselectable">
                        {ao12 !== undefined ? formatTime(ao12) : "-"}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </Show>

      <div id="timer">
        <div class="spacer" />
        <Switch fallback={<TimerStopwatch />}>
          <Match when={config.timerType === "timer"}>
            <TimerStopwatch />
          </Match>
          <Match when={config.timerType === "typing"}>
            <TimerInput />
          </Match>
        </Switch>
        <div class="spacer" />
      </div>
    </div>
  );
};
