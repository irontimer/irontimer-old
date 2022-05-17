/** @format */
import { Component, For } from "solid-js";
import { addResult, clearResults, getResults } from "../signal/result";
import "./Timer.scss";

function stringifyDate(timestamp: number): [string, string] {
  const date = new Date(timestamp);

  return [
    `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  ];
}

export const Timer: Component = () => {
  return (
    <div class="timer-page">
      <div id="results">
        <h1>Results</h1>
        <button onClick={() => clearResults()}>Clear</button>
        <table>
          <For each={getResults().reverse()}>
            {(result, getIndex) => (
              <tr>
                <td>{getResults().length - getIndex()}</td>
                <td>{result.time}</td>
                <td>{stringifyDate(result.timestamp)[0]}</td>
                <td>{stringifyDate(result.timestamp)[1]}</td>
              </tr>
            )}
          </For>
        </table>
      </div>
      <button
        onClick={() =>
          addResult({
            time: Math.round(Math.random() * 100000) / 1000,
            timestamp: new Date().getTime(),
            scramble: [],
            puzzle: {
              type: "Cube",
              layers: 3
            }
          })
        }
      >
        Add result
      </button>
    </div>
  );
};
