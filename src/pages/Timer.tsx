/** @format */
import { Component, createSignal } from "solid-js";
import { Popup } from "../components/Popup";
import { auth } from "../functions/auth";
import { calculateAverage } from "../functions/average";
import { deleteResult } from "../state/result";
import { parseTimeString, timeFormat } from "../functions/time";
import { addResult, getResults, getResultsReverse } from "../state/result";
import { getScramble, getScrambleType } from "../state/scramble";
import { Result, ResultIDLess } from "../types";
import "./Timer.scss";

export const Timer: Component = () => {
  const [getCurrentOpen, setCurrentOpen] = createSignal<number | undefined>();

  const getResultFromCurrentOpen = (): Result | ResultIDLess | undefined => {
    const currentOpen = getCurrentOpen();

    if (currentOpen === undefined) {
      return;
    }

    const result = getResults().at(-currentOpen);

    if (result === undefined) {
      return;
    }

    return result;
  };

  return (
    <div class="timer-page">
      <div id="results">
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

                    deleteResult(result, auth.currentUser?.uid);

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
                Scramble Type: {getResultFromCurrentOpen()?.scrambleType}
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
                const results = getResults().slice(index, index + n);

                if (results.length !== n) {
                  return;
                }

                return calculateAverage(results);
              });

              const n = (): number => getResults().length - index;

              const onClick = (): number => setCurrentOpen(n());

              return (
                <>
                  <tr>
                    <td onClick={onClick}>{n()}</td>
                    <td onClick={onClick}>{timeFormat(result.time)}</td>
                    <td>{ao5 !== undefined ? timeFormat(ao5) : "-"}</td>
                    <td>{ao12 !== undefined ? timeFormat(ao12) : "-"}</td>
                  </tr>
                </>
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
                  scramble: getScramble(),
                  scrambleType: getScrambleType()
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
