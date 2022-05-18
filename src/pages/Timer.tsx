/** @format */
import { Component, For } from "solid-js";
import { parseTimeString, timeFormat } from "../functions/time";
import { getPuzzle } from "../signal/puzzle";
import { addResult, clearResults, getResults } from "../signal/result";
import { getScramble } from "../signal/scramble";
import "./Timer.scss";

export const Timer: Component = () => {
  return (
    <div class="timer-page">
      <div id="results">
        <h1>Results</h1>
        <button onClick={() => clearResults()}>Clear</button>
        <table>
          <thead>
            <tr>
              <td>#</td>
              <td>Time</td>
              <td>ao5</td>
              <td>ao12</td>
            </tr>
          </thead>
          <tbody>
            <For each={getResults().sort((a, b) => b.timestamp - a.timestamp)}>
              {(result, getIndex) => {
                function i(): number {
                  return getResults().length - getIndex();
                }

                const lastFiveResults = getResults()
                  .slice(i() - 5, i())
                  .map((r) => r.time);

                const lastTwelveResults = getResults()
                  .slice(i() - 12, i())
                  .map((r) => r.time);

                const ao5 =
                  lastFiveResults.reduce((acc, cur) => acc + cur, 0) / 5;

                const ao12 =
                  lastTwelveResults.reduce((acc, cur) => acc + cur, 0) / 12;

                return (
                  <tr>
                    <td>{i()}</td>
                    <td>{timeFormat(result.time)}</td>
                    <td>{i() >= 5 ? timeFormat(ao5) : "-"}</td>
                    <td>{i() >= 12 ? timeFormat(ao12) : "-"}</td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>

      <div id="timer">
        <input
          onKeyPress={(e) => {
            if (e.key !== "Enter") {
              return;
            }

            const val = e.currentTarget.value;

            let float = /[^0-9.]/.test(val) ? NaN : parseFloat(val);

            if (isNaN(float)) {
              float = parseTimeString(val);
            }

            if (isNaN(float)) {
              alert("Entered time is not a number");

              e.currentTarget.value = "";

              return;
            }

            if (float % 1 === 0 && !val.includes(".")) {
              float /= 1000;
            }

            addResult({
              time: float,
              timestamp: Date.now(),
              puzzle: getPuzzle(),
              scramble: getScramble()
            });

            e.currentTarget.value = "";
          }}
        />
      </div>
    </div>
  );
};
