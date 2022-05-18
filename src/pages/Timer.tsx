/** @format */
import { Component } from "solid-js";
import { calculateAverage } from "../functions/average";
import { parseTimeString, timeFormat } from "../functions/time";
import { getPuzzle } from "../signal/puzzle";
import {
  addResult,
  clearResults,
  getResults,
  getResultsReverse
} from "../signal/result";
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
            {getResultsReverse().map((result, index) => {
              const [ao5, ao12] = [5, 12].map((n) =>
                calculateAverage(getResults().slice(index, index + n), n)
              );

              return (
                <tr>
                  <td>{getResults().length - index}</td>
                  <td>{timeFormat(result.time)}</td>
                  <td>{ao5 !== undefined ? timeFormat(ao5) : "-"}</td>
                  <td>{ao12 !== undefined ? timeFormat(ao12) : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div id="timer">
        <input
          placeholder="Enter time"
          onKeyPress={(e) => {
            if (e.key !== "Enter") {
              if (/[^0-9.:,]/.test(e.key)) {
                e.preventDefault();
              }

              return;
            }

            const val = e.currentTarget.value.replace(/,/g, "");

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
