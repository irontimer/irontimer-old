/** @format */
import { Component } from "solid-js";
import { auth } from "../functions/auth";
import { calculateAverage } from "../functions/average";
import { parseTimeString, timeFormat } from "../functions/time";
import { getPuzzle } from "../state/puzzle";
import { addResult, getResults, getResultsReverse } from "../state/result";
import { getScramble } from "../state/scramble";
import "./Timer.scss";

export const Timer: Component = () => {
  return (
    <div class="timer-page">
      <div id="results">
        <h1>Results</h1>
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
              const [ao5, ao12] = [5, 12].map((n) => {
                const results = getResultsReverse().slice(index, index + n);

                if (results.length !== n) {
                  return;
                }

                if (n === 12) {
                  console.log(results);
                }

                return calculateAverage(results);
              });

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
            } else {
              if (float % 1 === 0 && !val.includes(".")) {
                float /= 1000;
              }

              addResult(
                {
                  time: float,
                  timestamp: Date.now(),
                  puzzle: getPuzzle(),
                  scramble: getScramble()
                },
                auth.currentUser?.uid
              );
            }

            e.currentTarget.value = "";
          }}
        />
      </div>
    </div>
  );
};
